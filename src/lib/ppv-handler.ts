/**
 * PPV Handler - Parse and manage PPV commands in scripts
 */

export interface PPVCommand {
  type: 'PHOTO' | 'VIDEO' | 'BUNDLE';
  price: number;
  description?: string;
  photos?: number;
  videos?: number;
  rawCommand: string;
  position: number;
}

export interface PPVPaymentStatus {
  id: string;
  commandId: string;
  userUuid: string;
  amount: number;
  status: 'pending' | 'paid' | 'expired' | 'cancelled';
  createdAt: Date;
  paidAt?: Date;
  expiresAt: Date;
}

/**
 * Parse PPV commands from script content
 * Supports two formats:
 * - [PPV:type:price:description]
 * - {{PPV:TYPE:price=AMOUNT:description=TEXT}}
 */
export function parsePPVCommands(scriptContent: string): PPVCommand[] {
  const commands: PPVCommand[] = [];

  // Format 1: [PPV:type:price:description]
  const bracketRegex = /\[PPV:([^\]]+)\]/g;
  let match;

  while ((match = bracketRegex.exec(scriptContent)) !== null) {
    const [fullMatch, params] = match;
    const parts = params.split(':');
    
    if (parts.length >= 3) {
      const type = parts[0].toUpperCase() as PPVCommand['type'];
      const price = parseFloat(parts[1]);
      const description = parts.slice(2).join(':'); // Handle : in description

      if (['PHOTO', 'VIDEO', 'BUNDLE'].includes(type) && price > 0) {
        commands.push({
          type,
          price,
          description,
          rawCommand: fullMatch,
          position: match.index,
        });
      }
    }
  }

  // Format 2: {{PPV:TYPE:price=AMOUNT:description=TEXT}}
  const braceRegex = /\{\{PPV:([^}]+)\}\}/g;
  
  while ((match = braceRegex.exec(scriptContent)) !== null) {
    const [fullMatch, params] = match;
    const parts = params.split(':');
    
    if (parts.length < 2) continue;

    const type = parts[0].toUpperCase() as PPVCommand['type'];
    const commandParams: Record<string, string> = {};

    // Parse key=value pairs
    for (let i = 1; i < parts.length; i++) {
      const [key, ...valueParts] = parts[i].split('=');
      if (key && valueParts.length > 0) {
        commandParams[key] = valueParts.join('=');
      }
    }

    const command: PPVCommand = {
      type,
      price: parseFloat(commandParams.price || '0'),
      description: commandParams.description,
      photos: commandParams.photos ? parseInt(commandParams.photos) : undefined,
      videos: commandParams.videos ? parseInt(commandParams.videos) : undefined,
      rawCommand: fullMatch,
      position: match.index,
    };

    if (['PHOTO', 'VIDEO', 'BUNDLE'].includes(type) && command.price > 0) {
      commands.push(command);
    }
  }

  return commands;
}

/**
 * Replace PPV command with actual message text
 */
export function replacePPVCommand(
  scriptContent: string,
  command: PPVCommand,
  messageText: string
): string {
  return scriptContent.replace(command.rawCommand, messageText);
}

/**
 * Generate PPV message text based on command
 */
export function generatePPVMessage(command: PPVCommand): string {
  const emoji = {
    PHOTO: '📸',
    VIDEO: '🎥',
    BUNDLE: '🎁',
  };

  let message = `${emoji[command.type]} `;

  if (command.description) {
    message += command.description;
  } else {
    if (command.type === 'PHOTO') {
      message += 'Exclusive photo set';
    } else if (command.type === 'VIDEO') {
      message += 'Exclusive video';
    } else if (command.type === 'BUNDLE') {
      message += 'Premium content bundle';
      if (command.photos && command.videos) {
        message += ` (${command.photos} photos + ${command.videos} videos)`;
      }
    }
  }

  message += `\n\n💰 Unlock for $${command.price}`;

  return message;
}

/**
 * Generate unlock message after payment
 */
export function generateUnlockMessage(command: PPVCommand): string {
  const messages = {
    PHOTO: '🔓 Here are your exclusive photos! Enjoy babe 💋',
    VIDEO: '🔓 Video unlocked! Hope you love it 😘',
    BUNDLE: '🔓 Your premium bundle is ready! Thanks for your support 💕',
  };

  return messages[command.type];
}

/**
 * Generate reminder message for unpaid PPV
 */
export function generateReminderMessage(command: PPVCommand, hoursWaiting: number): string {
  return `Hey! Just wanted to remind you about the ${command.type.toLowerCase()} I sent earlier 😊\n\n` +
    `It's still available for $${command.price} if you're interested! ✨`;
}

/**
 * Check if payment is expired (default: 24 hours)
 */
export function isPaymentExpired(status: PPVPaymentStatus): boolean {
  return new Date() > status.expiresAt;
}

/**
 * Create a payment tracking record
 */
export function createPaymentTracking(
  commandId: string,
  userUuid: string,
  amount: number,
  expiresInHours: number = 24
): PPVPaymentStatus {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + expiresInHours * 60 * 60 * 1000);

  return {
    id: `ppv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    commandId,
    userUuid,
    amount,
    status: 'pending',
    createdAt: now,
    expiresAt,
  };
}

/**
 * Process script with PPV commands
 * Returns array of message segments to send sequentially
 */
export function processScriptWithPPV(scriptContent: string): Array<{
  type: 'message' | 'ppv';
  content: string;
  ppvCommand?: PPVCommand;
}> {
  const commands = parsePPVCommands(scriptContent);
  
  if (commands.length === 0) {
    return [{ type: 'message', content: scriptContent }];
  }

  const segments: Array<{
    type: 'message' | 'ppv';
    content: string;
    ppvCommand?: PPVCommand;
  }> = [];

  let lastPosition = 0;

  // Sort commands by position
  commands.sort((a, b) => a.position - b.position);

  for (const command of commands) {
    // Add text before PPV command
    if (command.position > lastPosition) {
      const beforeText = scriptContent.substring(lastPosition, command.position).trim();
      if (beforeText) {
        segments.push({ type: 'message', content: beforeText });
      }
    }

    // Add PPV command
    segments.push({
      type: 'ppv',
      content: generatePPVMessage(command),
      ppvCommand: command,
    });

    lastPosition = command.position + command.rawCommand.length;
  }

  // Add remaining text after last PPV command
  if (lastPosition < scriptContent.length) {
    const afterText = scriptContent.substring(lastPosition).trim();
    if (afterText) {
      segments.push({ type: 'message', content: afterText });
    }
  }

  return segments;
}

/**
 * Validate PPV command syntax
 * Supports both formats:
 * - [PPV:type:price:description]
 * - {{PPV:TYPE:price=AMOUNT:description=TEXT}}
 */
export function validatePPVCommand(commandString: string): {
  valid: boolean;
  error?: string;
} {
  // Format 1: [PPV:type:price:description]
  const bracketRegex = /\[PPV:([^\]]+)\]/;
  const bracketMatch = commandString.match(bracketRegex);

  if (bracketMatch) {
    const [, params] = bracketMatch;
    const parts = params.split(':');

    if (parts.length < 3) {
      return { valid: false, error: 'Format should be [PPV:type:price:description]' };
    }

    const type = parts[0].toUpperCase();
    if (!['PHOTO', 'VIDEO', 'BUNDLE'].includes(type)) {
      return { valid: false, error: 'Invalid type. Must be photo, video, or bundle' };
    }

    const price = parseFloat(parts[1]);
    if (isNaN(price) || price <= 0) {
      return { valid: false, error: 'Price must be a number greater than 0' };
    }

    return { valid: true };
  }

  // Format 2: {{PPV:TYPE:price=AMOUNT:description=TEXT}}
  const braceRegex = /\{\{PPV:([^}]+)\}\}/;
  const braceMatch = commandString.match(braceRegex);

  if (!braceMatch) {
    return { valid: false, error: 'Invalid PPV command format. Use [PPV:type:price:description] or {{PPV:TYPE:price=AMOUNT}}' };
  }

  const [, params] = braceMatch;
  const parts = params.split(':');

  if (parts.length < 2) {
    return { valid: false, error: 'Missing required parameters' };
  }

  const type = parts[0].toUpperCase();
  if (!['PHOTO', 'VIDEO', 'BUNDLE'].includes(type)) {
    return { valid: false, error: 'Invalid type. Must be PHOTO, VIDEO, or BUNDLE' };
  }

  const priceMatch = params.match(/price=(\d+\.?\d*)/);
  if (!priceMatch) {
    return { valid: false, error: 'Missing or invalid price parameter' };
  }

  const price = parseFloat(priceMatch[1]);
  if (price <= 0) {
    return { valid: false, error: 'Price must be greater than 0' };
  }

  return { valid: true };
}
