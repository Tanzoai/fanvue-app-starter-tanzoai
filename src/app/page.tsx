import { redirect } from 'next/navigation';
import Image from "next/image";
import { getCurrentUser } from "@/lib/fanvue";

export default async function Home({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
  const me = await getCurrentUser();
  const isAuthed = !!me;
  
  // If user is already authenticated, redirect to dashboard
  if (isAuthed) {
    redirect('/dashboard');
  }
  
  const params = await searchParams;
  const errorParam = typeof params?.error === "string" ? params.error : undefined;
  const errorDescriptionParam = typeof params?.error_description === "string" ? params.error_description : undefined;
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <main className="flex flex-col gap-[24px] row-start-2 items-center sm:items-start max-w-[720px] w-full">
        <Image
          src="/logo192.png"
          alt="Fanvue"
          width={180}
          height={38}
          priority
        />
        <div className="w-full rounded-lg border border-white/[.145] bg-white/5 backdrop-blur-md p-4 sm:p-6">
          <div className="flex flex-col items-center justify-center gap-6 text-center">
            <h2 className="font-semibold text-2xl text-white">Fanvue App Starter</h2>
            <p className="text-sm text-white/70 max-w-md">
              Manage your Fanvue account with powerful analytics, automated messaging scripts, and AI-powered chat assistance.
            </p>
            {errorParam || errorDescriptionParam ? (
              <div className="mt-3 text-sm text-red-400 p-3 bg-red-500/10 rounded-lg border border-red-500/30">
                {(errorDescriptionParam as string) || (errorParam as string)}
              </div>
            ) : null}
            <a
              className="rounded-full border border-solid border-transparent transition-colors bg-[#49f264ff] hover:bg-[#49f26433] text-black hover:text-white px-6 h-12 flex items-center gap-2 cursor-pointer font-semibold text-lg shadow-[0_0_20px_rgba(73,242,100,0.5)] hover:shadow-[0_0_30px_rgba(73,242,100,0.8)]"
              href="/api/oauth/login"
              target="_top"
            >
              <Image aria-hidden src="/logo192.png" alt="" width={24} height={24} />
              Login with Fanvue
            </a>
          </div>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-white/70 hover:text-white"
          href="https://api.fanvue.com/docs"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="Docs icon"
            width={16}
            height={16}
          />
          Fanvue API Docs
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-white/70 hover:text-white"
          href="https://fanvue.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Website icon"
            width={16}
            height={16}
          />
          Visit fanvue.com →
        </a>
      </footer>
    </div>
  );
}
