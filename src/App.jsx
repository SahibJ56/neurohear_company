import React, { useState, useEffect, useRef } from "react";
import {
  Volume2,
  Ear,
  Activity,
  ArrowRight,
  Home,
  Check,
  X,
  AlertCircle,
  Play,
  Mic,
  Mail,
  Scan,
  Info,
} from "lucide-react";

// =========================================================================
// !!! DATA CONFIGURATION !!!
// =========================================================================

const SPEECH_TEST_ITEMS = [
  { text: "The dog wagged its tail", targetWord: "Tail", options: ["Tail", "Jail", "Fail"], volume: 0.3, faintVolume: 0.1 },
  { text: "She bought a new dress", targetWord: "Dress", options: ["Dress", "Press", "Desk"], volume: 0.3, faintVolume: 0.1 },
  { text: "We left the party early", targetWord: "Early", options: ["Early", "Burly", "Hurry"], volume: 0.3, faintVolume: 0.1 },
  { text: "The plane is about to land", targetWord: "Land", options: ["Land", "Hand", "Sand"], volume: 0.3, faintVolume: 0.1 },
  { text: "He turned off the light", targetWord: "Light", options: ["Light", "Right", "Mite"], volume: 0.3, faintVolume: 0.1 },
  { text: "I need to take a break", targetWord: "Break", options: ["Break", "Rake", "Bake"], volume: 0.3, faintVolume: 0.1 },
  { text: "The children like to play", targetWord: "Play", options: ["Play", "Gray", "Day"], volume: 0.3, faintVolume: 0.1 },
];

const ALL_TRAINER_QUESTIONS = [
  // Level 1
  { word: "Chair", options: ["Pair", "Chair", "Share"], hasNoise: false, volume: 1.0, difficulty: 1 },
  { word: "Desk", options: ["Desk", "Best", "Test"], hasNoise: false, volume: 1.0, difficulty: 1 },
  { word: "Apple", options: ["Apple", "Aptly", "Apply"], hasNoise: false, volume: 0.9, difficulty: 1 },
  { word: "Book", options: ["Book", "Look", "Took"], hasNoise: false, volume: 0.9, difficulty: 1 },
  { word: "Table", options: ["Table", "Stable", "Cable"], hasNoise: false, volume: 0.8, difficulty: 1 },
  // Level 2
  { word: "Water", options: ["Waiter", "Water", "Walker"], hasNoise: false, volume: 0.5, difficulty: 2 },
  { word: "Window", options: ["Window", "Wander", "Wonder"], hasNoise: false, volume: 0.45, difficulty: 2 },
  { word: "Listen", options: ["License", "Listen", "Lessened"], hasNoise: false, volume: 0.4, difficulty: 2 },
  { word: "Purple", options: ["Purple", "Perfect", "Purpose"], hasNoise: false, volume: 0.35, difficulty: 2 },
  { word: "Silver", options: ["Silver", "Sliver", "Solver"], hasNoise: false, volume: 0.3, difficulty: 2 },
  // Level 3
  { word: "Coffee", options: ["Copy", "Coffee", "Cookie"], hasNoise: true, noiseLevel: 0.05, volume: 1.0, difficulty: 3 },
  { word: "Bread", options: ["Bed", "Bled", "Bread"], hasNoise: true, noiseLevel: 0.07, volume: 0.9, difficulty: 3 },
  { word: "Light", spokenText: "Could you dim the light?", options: ["Light", "Night", "Fight"], hasNoise: true, noiseLevel: 0.06, volume: 0.9, isSentence: true, difficulty: 3 },
  { word: "Exit", options: ["Exit", "Expert", "Except"], hasNoise: true, noiseLevel: 0.04, volume: 0.8, difficulty: 3 },
  { word: "Ticket", spokenText: "Where is my train ticket?", options: ["Ticket", "Ticked", "Tackle"], hasNoise: true, noiseLevel: 0.05, volume: 0.8, isSentence: true, difficulty: 3 },
  // Level 4
  { word: "Thirteen", spokenText: "The number I need is thirteen.", options: ["Thirteen", "Thirty", "Fourteen"], hasNoise: true, noiseLevel: 0.15, volume: 0.9, isSentence: true, difficulty: 4 },
  { word: "Money", spokenText: "Can you lend me some money?", options: ["Honey", "Money", "Sunny"], hasNoise: true, noiseLevel: 0.1, volume: 0.7, isSentence: true, difficulty: 4 },
  { word: "Listen", spokenText: "I can't listen over this sound.", options: ["Listen", "Lessen", "Lesson"], hasNoise: true, noiseLevel: 0.12, volume: 0.8, isSentence: true, difficulty: 4 },
  { word: "Bag", options: ["Back", "Bag", "Pad"], hasNoise: true, noiseLevel: 0.13, volume: 0.9, difficulty: 4 },
  { word: "Eight", spokenText: "What time is eight?", options: ["Ate", "Eight", "Late"], hasNoise: true, noiseLevel: 0.11, volume: 0.8, isSentence: true, difficulty: 4 },
  // Level 5
  { word: "Baggage", spokenText: "Please collect your baggage now.", options: ["Baggage", "Managed", "Package"], hasNoise: true, noiseLevel: 0.2, volume: 1.0, isSentence: true, difficulty: 5 },
  { word: "Appointment", spokenText: "I have an important appointment today.", options: ["Appointment", "Disappointment", "Entertainment"], hasNoise: true, noiseLevel: 0.18, volume: 0.9, isSentence: true, difficulty: 5 },
  { word: "Doctor", options: ["Doctor", "Daughter", "Docker"], hasNoise: true, noiseLevel: 0.22, volume: 0.85, difficulty: 5 },
  { word: "Seventy", spokenText: "The final number is seventy-one.", options: ["Seventy", "Seventeen", "Sixteen"], hasNoise: true, noiseLevel: 0.19, volume: 0.95, isSentence: true, difficulty: 5 },
  { word: "Family", spokenText: "I called my family.", options: ["Family", "Finally", "Firmly"], hasNoise: true, noiseLevel: 0.21, volume: 0.9, isSentence: true, difficulty: 5 },
];

const THEME = {
  bg: "bg-[#F7F5EE]",
  text: "text-[#2C4A3B]",
  primary: "bg-[#7E9F85]",
  primaryHover: "hover:bg-[#65856C]",
  secondary: "bg-[#E8CDB6]",
  card: "bg-[#FFFFFF]",
  warning: "bg-[#E8CDB6] text-[#5C3A2A]",
};

// =========================================================================
// !!! COMPONENTS !!!
// =========================================================================

function IntroModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className={`max-w-md w-full ${THEME.card} rounded-3xl p-8 shadow-2xl space-y-6 transform transition-all duration-300 scale-100`}>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${THEME.primary} text-white`}>
              <Ear size={32} />
            </div>
            <h2 className={`text-3xl font-bold ${THEME.text}`}>Welcome to NeuroHear</h2>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>
        <p className="text-lg text-[#5C7A6B] leading-relaxed">
          This application provides tools for **assessing** and **training** your auditory cognitive function. It is designed to challenge your brain's ability to process sound, especially in difficult listening environments.
        </p>
        <ul className="list-disc list-inside space-y-2 text-[#5C7A6B] ml-4">
          <li><strong className={THEME.text}>Test My Hearing:</strong> An advanced screener for volume sensitivity and word recognition.</li>
          <li><strong className={THEME.text}>Train My Brain:</strong> A fun, gamified system to practice hearing words against increasing levels of background noise.</li>
        </ul>
        <div className={`p-4 rounded-xl ${THEME.warning} text-sm flex items-center gap-3`}>
          <AlertCircle size={20} className="text-[#5C3A2A]" />
          **Disclaimer:** This is for cognitive training purposes only and is not a substitute for professional medical advice.
        </div>
        <button onClick={onClose} className={`w-full ${THEME.primary} text-white py-4 rounded-2xl text-xl font-bold shadow-lg hover:bg-[#65856C] transition-colors`}>
          Get Started
        </button>
      </div>
    </div>
  );
}

function AboutPage({ onBack }) {
  return (
    <div className="flex flex-col gap-6 pt-4 animate-fade-in">
      <h2 className={`text-3xl font-bold ${THEME.text}`}>About NeuroHear</h2>
      <div className={`${THEME.card} p-6 rounded-2xl shadow-lg space-y-4`}>
        <h3 className={`text-xl font-bold ${THEME.text}`}>Our Mission</h3>
        <p className="text-[#5C7A6B] leading-relaxed">
          NeuroHear was developed as a proof-of-concept for an accessible, daily cognitive auditory trainer. Auditory processing and cognitive load are critical for effective communication.
        </p>
        <p className="text-[#5C7A6B] leading-relaxed">
          By simulating real-world listening challenges (faint speech, speech in noise), we aim to provide a convenient way to exercise the brain's filtering abilities.
        </p>
      </div>
      <div className={`${THEME.card} p-6 rounded-2xl shadow-lg space-y-4`}>
        <h3 className={`text-xl font-bold ${THEME.text}`}>Key Features</h3>
        <ul className="list-disc list-inside space-y-2 text-[#5C7A6B] ml-4">
          <li><strong className={THEME.text}>Advanced Screener:</strong> Checks pure tone detection and word clarity.</li>
          <li><strong className={THEME.text}>Speech-in-Noise Training:</strong> Progressive levels of difficulty.</li>
          <li><strong className={THEME.text}>Web Audio API:</strong> Uses native browser capabilities.</li>
        </ul>
      </div>
      <button onClick={onBack} className={`w-full ${THEME.secondary} text-[#5C3A2A] py-4 rounded-2xl text-xl font-bold shadow-sm mt-4`}>
        Back to Home
      </button>
    </div>
  );
}

function HomeScreen({ onNavigate }) {
  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div className="text-center space-y-2 mt-4">
        <h2 className={`text-3xl font-bold ${THEME.text}`}>Hello, Friend.</h2>
        <p className="text-lg text-[#5C7A6B] leading-relaxed">
          Welcome to your daily hearing health companion. What would you like to do today?
        </p>
      </div>
      <div className="space-y-6">
        {/* Step 1: Screener */}
        <button onClick={() => onNavigate("screener")} className={`w-full group relative overflow-hidden rounded-3xl ${THEME.card} shadow-lg border-2 border-transparent hover:border-[#7E9F85] transition-all duration-300 p-6 text-left`}>
          <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${THEME.text}`}><Activity size={120} /></div>
          <div className="relative z-10 space-y-4">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${THEME.secondary} text-[#5C3A2A] text-sm font-bold`}>STEP 1</div>
            <div>
              <h3 className={`text-2xl font-bold ${THEME.text}`}>Test My Hearing</h3>
              <p className="text-[#5C7A6B] mt-1">Comprehensive frequency & speech check.</p>
            </div>
            <div className={`inline-flex items-center gap-2 ${THEME.primary} text-white px-6 py-3 rounded-xl font-semibold shadow-sm group-hover:scale-105 transition-transform`}>
              Start Test <ArrowRight size={20} />
            </div>
          </div>
        </button>

        {/* Step 2: Trainer */}
        <button onClick={() => onNavigate("trainer")} className={`w-full group relative overflow-hidden rounded-3xl ${THEME.card} shadow-lg border-2 border-transparent hover:border-[#7E9F85] transition-all duration-300 p-6 text-left`}>
          <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${THEME.text}`}><Volume2 size={120} /></div>
          <div className="relative z-10 space-y-4">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${THEME.secondary} text-[#5C3A2A] text-sm font-bold`}>STEP 2</div>
            <div>
              <h3 className={`text-2xl font-bold ${THEME.text}`}>Train My Brain</h3>
              <p className="text-[#5C7A6B] mt-1">Practice listening in noise.</p>
            </div>
            <div className={`inline-flex items-center gap-2 ${THEME.primary} text-white px-6 py-3 rounded-xl font-semibold shadow-sm group-hover:scale-105 transition-transform`}>
              Start Training <ArrowRight size={20} />
            </div>
          </div>
        </button>

        {/* Step 3: 3D Scan (Coming Soon) */}
        <div className={`w-full relative overflow-hidden rounded-3xl ${THEME.card} shadow-lg border-2 border-[#D4E0D6] p-6 text-left opacity-70 cursor-not-allowed`}>
          <div className={`absolute top-0 right-0 p-4 opacity-10 transition-opacity ${THEME.text}`}><Scan size={120} /></div>
          <div className="relative z-10 space-y-4">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-300 text-gray-700 text-sm font-bold`}>STEP 3</div>
            <div>
              <h3 className={`text-2xl font-bold text-gray-500`}>3D Fitting Scan</h3>
              <p className="text-gray-400 mt-1">AI-guided ear scan for device fitting.</p>
            </div>
            <div className={`inline-flex items-center gap-2 bg-gray-400 text-white px-6 py-3 rounded-xl font-semibold`}>Coming Soon</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScreenerStep({ onBack }) {
  const [step, setStep] = useState("intro");
  const [testIndex, setTestIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);

  const createTestSequence = () => {
    const availableItems = [...SPEECH_TEST_ITEMS];
    const getRandomItem = () => {
      if (availableItems.length === 0) return { text: "Safety Check", targetWord: "Check", options: ["Check", "Break", "Next"], volume: 0.3, faintVolume: 0.1 };
      const index = Math.floor(Math.random() * availableItems.length);
      return availableItems.splice(index, 1)[0];
    };
    const item1 = getRandomItem();
    const item2 = getRandomItem();
    return [
      { type: "tone", freq: 1000, gain: 0.1, label: "Mid Pitch (Standard)", desc: "Can you hear this beep?" },
      { type: "tone", freq: 1000, gain: 0.01, label: "Mid Pitch (Faint)", desc: "This one is very quiet. Listen closely." },
      { type: "tone", freq: 4000, gain: 0.1, label: "High Pitch (Standard)", desc: "Can you hear this beep?" },
      { type: "tone", freq: 4000, gain: 0.01, label: "High Pitch (Faint)", desc: "This one is very quiet. Listen closely." },
      { type: "speech", text: item1.text, targetWord: item1.targetWord, options: item1.options, volume: item1.volume, label: "Speech Clarity", desc: "I will say a sentence. Select the LAST word you hear." },
      { type: "speech", text: item2.text, targetWord: item2.targetWord, options: item2.options, volume: item2.faintVolume, label: "Faint Speech", desc: "One more sentence. It will be very quiet." },
    ];
  };

  const [testSequence] = useState(createTestSequence());
  const currentTest = testSequence[testIndex];
  const audioCtxRef = useRef(null);
  const oscillatorRef = useRef(null);

  useEffect(() => { return () => stopTone(); }, []);

  const getAudioContext = async () => {
    if (!audioCtxRef.current) { audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)(); }
    if (audioCtxRef.current.state === "suspended") { await audioCtxRef.current.resume(); }
    return audioCtxRef.current;
  };

  const playTone = async (freq, gainVal) => {
    const ctx = await getAudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(gainVal, ctx.currentTime + 0.1);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.start();
    oscillatorRef.current = osc;
    setIsPlaying(true);
    setTimeout(() => { stopTone(); }, 1500);
  };

  const playSpeech = (text, vol) => {
    if (window.speechSynthesis.speaking) { window.speechSynthesis.cancel(); }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = vol;
    utterance.rate = 0.8;
    setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
  };

  const handlePlay = () => {
    if (currentTest.type === "tone") { playTone(currentTest.freq, currentTest.gain); }
    else { playSpeech(currentTest.text, currentTest.volume); }
  };

  const stopTone = () => {
    if (oscillatorRef.current) {
      try { oscillatorRef.current.stop(); oscillatorRef.current.disconnect(); } catch (e) {}
      oscillatorRef.current = null;
    }
    setIsPlaying(false);
  };

  const handleResponse = (isCorrect) => {
    stopTone();
    if (isCorrect) setScore((s) => s + 1);
    if (testIndex < testSequence.length - 1) { setTestIndex((prev) => prev + 1); }
    else { setStep("result"); }
  };

  if (step === "intro") {
    return (
      <div className="flex flex-col h-full justify-between gap-6">
        <div className="space-y-6">
          <h2 className={`text-3xl font-bold ${THEME.text}`}>Advanced Screener</h2>
          <div className={`p-6 rounded-2xl ${THEME.warning} flex flex-col gap-4`}>
            <div className="flex items-center gap-3">
              <AlertCircle size={32} className="text-[#5C3A2A]" />
              <h3 className="font-bold text-xl text-[#5C3A2A]">Setup</h3>
            </div>
            <p className="text-[#5C3A2A] text-lg leading-relaxed">
              This test checks both **volume sensitivity** and **word recognition**. <br /><br />
              Some sounds will be normal volume, others will be very faint (almost silent). **Do not adjust your volume** during the test.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <p className={`text-lg ${THEME.text}`}>Set your volume to 50% now. We will handle the rest.</p>
          </div>
        </div>
        <button onClick={() => setStep("test")} className={`w-full ${THEME.primary} text-white py-5 rounded-2xl text-xl font-bold shadow-lg active:scale-95 transition-transform`}>
          Start Screener
        </button>
      </div>
    );
  }

  if (step === "test") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
        <div className="w-full space-y-2">
          <div className="flex justify-between text-[#5C7A6B] font-medium uppercase tracking-wide text-sm">
            <span>Test {testIndex + 1} of {testSequence.length}</span>
            <span>{currentTest.label}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-[#7E9F85] h-2 rounded-full transition-all duration-300" style={{ width: `${(testIndex / testSequence.length) * 100}%` }}></div>
          </div>
        </div>
        <h2 className={`text-2xl font-bold ${THEME.text} mt-4`}>{currentTest.type === "tone" ? "Listen for the Tone" : "Listen to the Sentence"}</h2>
        <p className="text-[#5C7A6B] text-lg">{currentTest.desc}</p>
        <div className="relative group py-4">
          <button onClick={handlePlay} disabled={isPlaying} className={`w-40 h-40 rounded-full ${isPlaying ? "bg-[#E8CDB6] animate-pulse" : THEME.primary} text-white flex flex-col items-center justify-center shadow-xl transition-all`}>
            {isPlaying ? (currentTest.type === "tone" ? <Volume2 size={56} /> : <Mic size={56} />) : <Play size={56} className="ml-2" />}
            <span className="mt-2 font-bold text-lg">{isPlaying ? "Playing..." : "Play"}</span>
          </button>
        </div>
        <div className="w-full mt-4">
          {currentTest.type === "tone" ? (
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => handleResponse(false)} className="bg-white border-2 border-gray-200 p-5 rounded-2xl text-lg font-bold text-gray-500 hover:border-red-400 hover:bg-red-50 transition-colors flex flex-col items-center gap-2">
                <X size={28} /> Silent
              </button>
              <button onClick={() => handleResponse(true)} className="bg-white border-2 border-[#7E9F85] p-5 rounded-2xl text-lg font-bold text-[#2C4A3B] hover:bg-[#F0F7F2] transition-colors flex flex-col items-center gap-2 shadow-md">
                <Check size={28} />I Heard It
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {currentTest.options?.map((opt) => (
                <button key={opt} onClick={() => handleResponse(opt === currentTest.targetWord)} className="bg-white border-2 border-[#E8CDB6] p-4 rounded-xl text-lg font-bold text-[#2C4A3B] hover:bg-[#E8CDB6] hover:text-[#5C3A2A] transition-colors">
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="text-center space-y-6 py-8">
      <div className={`w-24 h-24 mx-auto ${score > 3 ? THEME.primary : THEME.secondary} rounded-full flex items-center justify-center text-white mb-4`}>
        <Activity size={48} />
      </div>
      <h2 className={`text-3xl font-bold ${THEME.text}`}>Screener Complete</h2>
      <p className="text-lg text-[#5C7A6B] px-4">You identified **{score} out of {testSequence.length}** test sounds correctly.</p>
      <div className="bg-white p-6 rounded-2xl shadow-sm text-left space-y-3">
        <h3 className="font-bold text-[#2C4A3B]">Recommendation:</h3>
        <p className="text-[#5C7A6B]">
          {score > 4 ? "Your hearing response is strong today! Maintain it with 5 minutes of training." : "We noticed some difficulty with faint sounds. We recommend 15 minutes of Brain Training today."}
        </p>
      </div>
      <button onClick={onBack} className={`w-full ${THEME.primary} text-white py-4 rounded-2xl text-xl font-bold shadow-lg mt-4`}>Back to Menu</button>
    </div>
  );
}

function TrainerStep({ onBack }) {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [gameState, setGameState] = useState("playing");
  const [feedback, setFeedback] = useState("");
  const [userSelection, setUserSelection] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [currentQuestions, setCurrentQuestions] = useState([]);

  const filteredQuestions = ALL_TRAINER_QUESTIONS.filter((q) => q.difficulty === currentLevel);

  useEffect(() => {
    const shuffled = filteredQuestions.sort(() => 0.5 - Math.random());
    setCurrentQuestions(shuffled.slice(0, 5));
    setQuestionIndex(0);
  }, [currentLevel]);

  const currentQuestion = currentQuestions[questionIndex];
  const audioCtxRef = useRef(null);
  const noiseSourceRef = useRef(null);
  const gainNodeRef = useRef(null);
  const isSetupRef = useRef(false);

  const setupAudio = async () => {
    if (isSetupRef.current) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = ctx;
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) { data[i] = Math.random() * 2 - 1; }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;
      const gainNode = ctx.createGain();
      gainNode.gain.value = 0;
      noise.connect(gainNode);
      gainNode.connect(ctx.destination);
      noise.start(0);
      noiseSourceRef.current = noise;
      gainNodeRef.current = gainNode;
      isSetupRef.current = true;
    } catch (e) { console.error("Audio setup failed:", e); }
  };

  useEffect(() => {
    setupAudio();
    return () => {
      if (noiseSourceRef.current) {
        try { noiseSourceRef.current.stop(); noiseSourceRef.current.disconnect(); audioCtxRef.current?.close(); } catch (e) {}
      }
    };
  }, []);

  const setNoiseVolume = async (targetLevel, duration = 0.1) => {
    if (!audioCtxRef.current || !gainNodeRef.current) return;
    if (audioCtxRef.current.state === "suspended") { await audioCtxRef.current.resume(); }
    const ctx = audioCtxRef.current;
    const gainNode = gainNodeRef.current;
    const now = ctx.currentTime;
    gainNode.gain.cancelScheduledValues(now);
    gainNode.gain.setValueAtTime(gainNode.gain.value, now);
    gainNode.gain.linearRampToValueAtTime(targetLevel, now + duration);
  };

  const speakWord = async () => {
    if (!currentQuestion || !isSetupRef.current || !audioCtxRef.current) return;
    if (audioCtxRef.current.state === "suspended") { await audioCtxRef.current.resume(); }
    window.speechSynthesis.cancel();
    setIsPlaying(true);
    if (currentQuestion.hasNoise) { await setNoiseVolume(currentQuestion.noiseLevel || 0, 0.05); }
    setTimeout(() => {
      const textToSpeak = currentQuestion.spokenText || currentQuestion.word;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.volume = currentQuestion.volume;
      utterance.rate = 0.9;
      utterance.onend = () => {
        setTimeout(async () => { await setNoiseVolume(0, 0.5); setIsPlaying(false); }, 500);
      };
      window.speechSynthesis.speak(utterance);
    }, currentQuestion.hasNoise ? 500 : 0);
  };

  const checkAnswer = (selected) => {
    const target = currentQuestion.word;
    setUserSelection(selected);
    setNoiseVolume(0, 0.1);
    if (selected === target) {
      setFeedback("correct");
      setTimeout(() => {
        setFeedback(""); setUserSelection(null);
        if (questionIndex < currentQuestions.length - 1) { setQuestionIndex((prev) => prev + 1); }
        else { setGameState("nextLevel"); }
      }, 1500);
    } else {
      setFeedback("wrong");
      const u = new SpeechSynthesisUtterance("Try again");
      window.speechSynthesis.speak(u);
      setTimeout(() => { setFeedback(""); setUserSelection(null); }, 1500);
    }
  };

  const handleProceed = () => {
    if (currentLevel < 5) { setGameState("playing"); setCurrentLevel((l) => l + 1); }
    else { setGameState("success"); }
  };

  const handleRepeat = () => {
    setGameState("playing");
    const shuffled = filteredQuestions.sort(() => 0.5 - Math.random());
    setCurrentQuestions(shuffled.slice(0, 5));
    setQuestionIndex(0);
  };

  if (gameState === "nextLevel") {
    const nextLevel = currentLevel + 1;
    const isFinal = nextLevel > 5;
    if (isFinal) {
      return (
        <div className="text-center space-y-6 py-10">
          <h2 className={`text-3xl font-bold ${THEME.text}`}>All Training Complete!</h2>
          <p className="text-lg text-[#5C7A6B]">You have completed the hardest level of Auditory Training.</p>
          <p className="text-sm text-gray-500">Your final recorded level is **Level 5**.</p>
          <button onClick={() => setGameState("success")} className={`w-full ${THEME.primary} text-white py-4 rounded-2xl text-xl font-bold shadow-lg mt-8`}>See Final Results</button>
          <button onClick={onBack} className={`w-full bg-gray-200 text-[#2C4A3B] py-4 rounded-2xl text-lg font-bold mt-4`}>Back to Menu</button>
        </div>
      );
    }
    return (
      <div className="text-center space-y-6 py-10">
        <h2 className={`text-3xl font-bold ${THEME.text}`}>Level {currentLevel} Complete!</h2>
        <p className="text-xl text-[#5C7A6B]">Would you like to continue to the harder **Level {nextLevel}**?</p>
        <div className="space-y-4 pt-4">
          <button onClick={handleProceed} className={`w-full ${THEME.primary} text-white py-4 rounded-2xl text-xl font-bold shadow-lg`}>Proceed to Level {nextLevel} (Recommended)</button>
          <button onClick={handleRepeat} className={`w-full bg-white border-2 border-[#E8CDB6] text-[#5C3A2A] py-4 rounded-2xl text-lg font-bold`}>Repeat Level {currentLevel}</button>
          <button onClick={onBack} className={`w-full bg-gray-200 text-[#2C4A3B] py-4 rounded-2xl text-lg font-bold mt-4`}>Finish for Today</button>
        </div>
      </div>
    );
  }

  if (gameState === "success") {
    return (
      <div className="text-center space-y-6 py-10">
        <div className={`w-24 h-24 mx-auto bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 mb-4`}><Volume2 size={48} /></div>
        <h2 className={`text-3xl font-bold ${THEME.text}`}>Success!</h2>
        <p className="text-lg text-[#5C7A6B]">Your highest completed level is **Level {currentLevel}**. Regular practice helps maintain strong cognitive function.</p>
        <SignUpForm level={currentLevel} />
        <button onClick={onBack} className={`w-full ${THEME.primary} text-white py-4 rounded-2xl text-xl font-bold shadow-lg mt-8`}>Back to Menu</button>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="text-center p-10 text-[#5C7A6B]"><Activity className="animate-spin mx-auto" size={40} /><p className="mt-4">Loading Level {currentLevel} Questions...</p></div>
    );
  }

  return (
    <div className="flex flex-col h-full justify-between pt-4">
      <div className="space-y-2 text-center">
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div className={`bg-[#7E9F85] h-2.5 rounded-full transition-all duration-500`} style={{ width: `${((questionIndex + 1) / currentQuestions.length) * 100}%` }}></div>
        </div>
        <p className="text-[#5C7A6B] font-bold uppercase tracking-widest text-sm">Level {currentLevel} | Question {questionIndex + 1} of 5</p>
        <h2 className={`text-2xl font-bold ${THEME.text}`}>{currentQuestion.title || "Auditory Training"}</h2>
        <p className="text-[#5C7A6B]">{currentQuestion.desc || "Listen carefully to the word or phrase."}</p>
      </div>
      <div className="flex justify-center py-8">
        <button onClick={speakWord} disabled={isPlaying} className={`w-40 h-40 rounded-full ${isPlaying ? "bg-[#E8CDB6] animate-pulse" : THEME.primary} shadow-[0_10px_20px_rgba(107,142,107,0.3)] hover:scale-105 active:scale-95 transition-all flex flex-col items-center justify-center text-white z-10 border-4 border-[#F7F5EE] ring-4 ring-[#7E9F85]/30`}>
          <Volume2 size={56} />
          <span className="mt-2 font-bold">{isPlaying ? "Listening..." : "Listen"}</span>
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4 pb-8">
        {currentQuestion.options.map((opt) => (
          <button key={opt} onClick={() => checkAnswer(opt)} disabled={feedback !== ""} className={`py-4 px-6 rounded-2xl text-xl font-bold border-2 shadow-sm transition-all ${feedback === "correct" && opt === currentQuestion.word ? "bg-green-100 border-green-500 text-green-800" : feedback === "wrong" && opt === userSelection ? "bg-red-50 border-red-200 text-red-800 opacity-80" : "bg-white border-gray-100 text-[#2C4A3B] hover:border-[#7E9F85] hover:bg-[#F0F7F2]"}`}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function SignUpForm({ level }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSignUp = async () => {
    if (!email || !email.includes("@")) { setMessage("Please enter a valid email address."); return; }
    setMessage(`Success! We'll send daily reminders to ${email}. Last level completed: L${level}. (Note: This is a hackathon prototype, the email is not actually sent.)`);
    setEmail("");
  };

  return (
    <div className={`p-6 rounded-2xl ${THEME.card} shadow-lg space-y-4`}>
      <h3 className="text-xl font-bold text-[#2C4A3B] flex items-center gap-2"><Mail size={24} /> Daily Training Reminder</h3>
      <p className="text-sm text-[#5C7A6B]">Sign up for daily email reminders to continue your Auditory Training journey. We'll remind you to check back tomorrow at **Level {level}**.</p>
      <input type="email" placeholder="Enter your email address" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7E9F85] focus:border-transparent transition-colors" />
      <button onClick={handleSignUp} className={`w-full ${THEME.secondary} text-[#5C3A2A] py-3 rounded-lg font-bold hover:bg-[#E0C0A4] transition-colors`}>Sign Up for Reminders</button>
      {message && <p className={`text-sm font-semibold ${message.includes("Success") ? "text-green-600" : "text-red-500"}`}>{message}</p>}
    </div>
  );
}

// =========================================================================
// !!! MAIN APP COMPONENT WRAPPER !!!
// =========================================================================

export default function NeuroHearApp() {
  const [currentView, setCurrentView] = useState("home");
  const [showIntroModal, setShowIntroModal] = useState(true);

  const renderView = () => {
    switch (currentView) {
      case "home": return <HomeScreen onNavigate={setCurrentView} />;
      case "screener": return <ScreenerStep onBack={() => setCurrentView("home")} />;
      case "trainer": return <TrainerStep onBack={() => setCurrentView("home")} />;
      case "about": return <AboutPage onBack={() => setCurrentView("home")} />;
      default: return <HomeScreen onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className={`min-h-screen ${THEME.bg} font-sans selection:bg-[#D4E0D6] flex flex-col`}>
      {showIntroModal && <IntroModal onClose={() => setShowIntroModal(false)} />}
      <header className="bg-white/80 backdrop-blur-sm border-b border-[#D4E0D6] p-4 sticky top-0 z-10">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView("home")}>
            <div className={`p-2 rounded-full ${THEME.primary} text-white`}><Ear size={24} /></div>
            <h1 className={`text-2xl font-bold ${THEME.text} tracking-tight`}>NeuroHear</h1>
          </div>
          <div className="flex items-center gap-2">
            {currentView !== "home" && (
              <button onClick={() => setCurrentView("home")} className={`p-2 rounded-full text-[#2C4A3B] hover:bg-[#D4E0D6] transition-colors`} title="Home">
                <Home size={24} />
              </button>
            )}
            <button onClick={() => setCurrentView("about")} className={`p-2 rounded-full text-[#2C4A3B] hover:bg-[#D4E0D6] transition-colors ${currentView === "about" ? THEME.primary : ""} ${currentView === "about" ? "text-white" : ""}`} title="About">
              <Info size={24} />
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-md mx-auto p-6 pb-20">{renderView()}</main>
    </div>
  );
}