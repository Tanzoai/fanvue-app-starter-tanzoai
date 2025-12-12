'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Lightbulb, AlertTriangle, Calendar, Target } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

interface Prediction {
  type: 'revenue' | 'optimization' | 'engagement' | 'risk';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  action?: string;
}

export default function PredictiveInsights() {
  const [predictions, setPredictions] = useState<Prediction[]>([
    {
      type: 'revenue',
      title: 'Projection Fin de Mois',
      description: 'Basée sur votre performance actuelle, vous atteindrez $42,500 ce mois-ci (+15% vs prévision)',
      confidence: 87,
      impact: 'high'
    },
    {
      type: 'optimization',
      title: 'Optimisation de Bio',
      description: 'Changez votre bio maintenant pour maximiser l\'engagement - vos stats stagnent depuis 3 jours',
      confidence: 92,
      impact: 'high',
      action: 'Mettre à jour'
    },
    {
      type: 'engagement',
      title: 'Meilleur Moment d\'Envoi',
      description: 'Les PPV envoyés entre 20h-22h ont 32% plus de chances d\'être achetés',
      confidence: 78,
      impact: 'medium'
    },
    {
      type: 'risk',
      title: 'Fan à Risque',
      description: '@username456 n\'a pas interagi depuis 5 jours malgré 3 tentatives d\'engagement',
      confidence: 85,
      impact: 'medium',
      action: 'Désactiver'
    }
  ]);

  const getIcon = (type: Prediction['type']) => {
    switch (type) {
      case 'revenue': return <TrendingUp className="w-5 h-5 text-green-400" />;
      case 'optimization': return <Lightbulb className="w-5 h-5 text-yellow-400" />;
      case 'engagement': return <Target className="w-5 h-5 text-blue-400" />;
      case 'risk': return <AlertTriangle className="w-5 h-5 text-red-400" />;
      default: return <TrendingUp className="w-5 h-5 text-gray-400" />;
    }
  };

  const getImpactColor = (impact: Prediction['impact']) => {
    switch (impact) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <GlassCard className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <Lightbulb className="w-6 h-6 text-yellow-400" />
        <h2 className="text-xl font-semibold text-white">Recommandations IA</h2>
      </div>

      <div className="space-y-4">
        {predictions.map((prediction, index) => (
          <div 
            key={index} 
            className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/30 hover:bg-gray-800/50 transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1">
                {getIcon(prediction.type)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-white text-sm">{prediction.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getImpactColor(prediction.impact)}`}>
                      Impact {prediction.impact}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">{prediction.description}</p>
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-gray-700 rounded-full h-1.5">
                      <div 
                        className="bg-blue-500 h-1.5 rounded-full" 
                        style={{ width: `${prediction.confidence}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 w-12">{prediction.confidence}%</span>
                  </div>
                </div>
              </div>
              
              {prediction.action && (
                <button className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-xs rounded-lg transition-colors whitespace-nowrap">
                  {prediction.action}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700/30">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Dernière mise à jour: Il y a 5 minutes</span>
          <button className="flex items-center gap-1 hover:text-gray-300 transition-colors">
            <Calendar className="w-3 h-3" />
            <span>Rapport Hebdo</span>
          </button>
        </div>
      </div>
    </GlassCard>
  );
}
