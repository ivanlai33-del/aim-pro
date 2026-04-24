export default function Loading() {
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
            <div className="relative">
                {/* Outer pulsing ring */}
                <div className="w-24 h-24 rounded-full border-2 border-indigo-500/20 animate-ping absolute inset-0"></div>
                
                {/* Main spinning loader */}
                <div className="w-24 h-24 rounded-full border-t-2 border-indigo-500 animate-spin"></div>
                
                {/* Inner AI eye/mascot indicator */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl rotate-45 flex items-center justify-center shadow-lg shadow-indigo-500/50 animate-pulse">
                        <div className="w-4 h-4 bg-white rounded-full -rotate-45"></div>
                    </div>
                </div>
            </div>
            
            <div className="mt-12 text-center">
                <h3 className="text-white font-bold text-lg mb-2">正在啟動 AI 職人大腦</h3>
                <div className="flex gap-1 justify-center">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
                </div>
            </div>
        </div>
    );
}
