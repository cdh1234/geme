import React, { useState } from 'react';
import { 
  GamepadIcon, 
  Users, 
  User, 
  Home, 
  Trophy, 
  Settings,
  Moon,
  Sun,
  Play,
  RotateCcw,
  CheckCircle,
  XCircle,
  Shuffle,
  Eye,
  EyeOff,
  Brain,
  Calculator,
  BookOpen,
  Zap,
  ArrowRight,
  ArrowLeft,
  Plus,
  Minus
} from 'lucide-react';

type GameType = 'individual' | 'group';
type Page = 'home' | 'individual' | 'group' | 'leaderboard' | 'settings';

interface Player {
  id: number;
  name: string;
  role?: string;
  isAlive?: boolean;
  revealed?: boolean;
}

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

interface MathQuestion {
  id: number;
  text: string;
  answer: number;
}

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Individual games state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentIndividualGame, setCurrentIndividualGame] = useState<string>('');
  const [mathAnswer, setMathAnswer] = useState('');
  const [memorySequence, setMemorySequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [showingSequence, setShowingSequence] = useState(false);
  const [memoryLevel, setMemoryLevel] = useState(1);
  
  // Group games state
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [gamePhase, setGamePhase] = useState<'setup' | 'playing' | 'finished'>('setup');
  const [currentGame, setCurrentGame] = useState<string>('');
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [showAllCards, setShowAllCards] = useState(false);
  const [currentLetter, setCurrentLetter] = useState('');
  const [categories] = useState(['جماد', 'نبات', 'حيوان', 'اسم', 'بلد', 'مهنة']);
  const [currentCategory, setCurrentCategory] = useState(0);
  const [gameTimer, setGameTimer] = useState(60);
  const [timerActive, setTimerActive] = useState(false);

  const questions: Question[] = [
    {
      id: 1,
      text: "ما هي عاصمة تونس؟",
      options: ["صفاقس", "تونس", "سوسة", "قابس"],
      correctAnswer: 1
    },
    {
      id: 2,
      text: "كم عدد أيام السنة؟",
      options: ["364", "365", "366", "367"],
      correctAnswer: 1
    },
    {
      id: 3,
      text: "ما هو أكبر كوكب في المجموعة الشمسية؟",
      options: ["الأرض", "المريخ", "المشتري", "زحل"],
      correctAnswer: 2
    },
    {
      id: 4,
      text: "من هو مؤسس شركة مايكروسوفت؟",
      options: ["ستيف جوبز", "بيل غيتس", "مارك زوكربيرغ", "إيلون ماسك"],
      correctAnswer: 1
    },
    {
      id: 5,
      text: "كم عدد قارات العالم؟",
      options: ["5", "6", "7", "8"],
      correctAnswer: 2
    }
  ];

  const mathQuestions: MathQuestion[] = [
    { id: 1, text: "15 + 27 = ?", answer: 42 },
    { id: 2, text: "8 × 9 = ?", answer: 72 },
    { id: 3, text: "144 ÷ 12 = ?", answer: 12 },
    { id: 4, text: "25² = ?", answer: 625 },
    { id: 5, text: "√64 = ?", answer: 8 }
  ];

  const loupGarouRoles = [
    "ذئب", "قروي", "عراف", "طبيب", "صياد", "ساحرة", "حارس", "عمدة"
  ];

  const arabicLetters = [
    'أ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'
  ];

  // Timer effect for letter game
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && gameTimer > 0) {
      interval = setInterval(() => {
        setGameTimer(prev => prev - 1);
      }, 1000);
    } else if (gameTimer === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, gameTimer]);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    if (answerIndex === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setGameStarted(false);
        setCurrentQuestion(0);
      }
    }, 2000);
  };

  const handleMathAnswer = () => {
    const userAnswer = parseInt(mathAnswer);
    const correct = userAnswer === mathQuestions[currentQuestion].answer;
    
    if (correct) {
      setScore(score + 1);
    }
    
    setShowResult(true);
    setSelectedAnswer(correct ? 1 : 0);
    
    setTimeout(() => {
      if (currentQuestion < mathQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setMathAnswer('');
        setShowResult(false);
        setSelectedAnswer(null);
      } else {
        setGameStarted(false);
        setCurrentQuestion(0);
        setMathAnswer('');
      }
    }, 2000);
  };

  const generateMemorySequence = () => {
    const sequence = [];
    for (let i = 0; i < memoryLevel + 2; i++) {
      sequence.push(Math.floor(Math.random() * 4));
    }
    setMemorySequence(sequence);
    setUserSequence([]);
    setShowingSequence(true);
    
    // Show sequence with delays
    sequence.forEach((_, index) => {
      setTimeout(() => {
        if (index === sequence.length - 1) {
          setShowingSequence(false);
        }
      }, (index + 1) * 800);
    });
  };

  const handleMemoryClick = (colorIndex: number) => {
    if (showingSequence) return;
    
    const newUserSequence = [...userSequence, colorIndex];
    setUserSequence(newUserSequence);
    
    // Check if sequence is correct so far
    const isCorrect = newUserSequence.every((color, index) => color === memorySequence[index]);
    
    if (!isCorrect) {
      // Wrong sequence
      setShowResult(true);
      setSelectedAnswer(0);
      setTimeout(() => {
        setGameStarted(false);
        setMemoryLevel(1);
      }, 2000);
    } else if (newUserSequence.length === memorySequence.length) {
      // Correct complete sequence
      setScore(score + 1);
      setMemoryLevel(memoryLevel + 1);
      setShowResult(true);
      setSelectedAnswer(1);
      setTimeout(() => {
        setShowResult(false);
        generateMemorySequence();
      }, 1500);
    }
  };

  const startIndividualGame = (gameType: string) => {
    setCurrentIndividualGame(gameType);
    setGameStarted(true);
    setScore(0);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setMathAnswer('');
    setMemoryLevel(1);
    
    if (gameType === 'memory') {
      generateMemorySequence();
    }
  };

  const addPlayer = () => {
    if (newPlayerName.trim()) {
      setPlayers([...players, { id: Date.now(), name: newPlayerName.trim(), revealed: false }]);
      setNewPlayerName('');
    }
  };

  const removePlayer = (id: number) => {
    setPlayers(players.filter(p => p.id !== id));
  };

  const startLoupGarou = () => {
    if (players.length < 4) {
      alert('يجب أن يكون هناك على الأقل 4 لاعبين');
      return;
    }
    
    const shuffledRoles = [...loupGarouRoles].sort(() => Math.random() - 0.5);
    const updatedPlayers = players.map((player, index) => ({
      ...player,
      role: shuffledRoles[index % shuffledRoles.length],
      isAlive: true,
      revealed: false
    }));
    
    setPlayers(updatedPlayers);
    setGamePhase('playing');
    setCurrentGame('loup-garou');
    setCurrentPlayerIndex(0);
  };

  const startMakeshGame = () => {
    if (players.length < 3) {
      alert('يجب أن يكون هناك على الأقل 3 لاعبين');
      return;
    }
    
    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
    const outsider = shuffledPlayers[0];
    const updatedPlayers = shuffledPlayers.map(player => ({
      ...player,
      role: player.id === outsider.id ? 'الغريب' : 'من الحومة',
      revealed: false
    }));
    
    setPlayers(updatedPlayers);
    setGamePhase('playing');
    setCurrentGame('makesh');
    setCurrentPlayerIndex(0);
  };

  const startLetterGame = () => {
    if (players.length < 2) {
      alert('يجب أن يكون هناك على الأقل لاعبين');
      return;
    }
    
    const randomLetter = arabicLetters[Math.floor(Math.random() * arabicLetters.length)];
    setCurrentLetter(randomLetter);
    setCurrentCategory(0);
    setGameTimer(60);
    setGamePhase('playing');
    setCurrentGame('letters');
  };

  const nextPlayer = () => {
    if (currentPlayerIndex < players.length - 1) {
      setCurrentPlayerIndex(currentPlayerIndex + 1);
    } else {
      setCurrentPlayerIndex(0);
    }
  };

  const prevPlayer = () => {
    if (currentPlayerIndex > 0) {
      setCurrentPlayerIndex(currentPlayerIndex - 1);
    } else {
      setCurrentPlayerIndex(players.length - 1);
    }
  };

  const togglePlayerReveal = (playerId: number) => {
    setPlayers(players.map(player => 
      player.id === playerId 
        ? { ...player, revealed: !player.revealed }
        : player
    ));
  };

  const resetGame = () => {
    setPlayers([]);
    setGamePhase('setup');
    setCurrentGame('');
    setCurrentPlayerIndex(0);
    setShowAllCards(false);
    setCurrentLetter('');
    setGameTimer(60);
    setTimerActive(false);
  };

  const Button = ({ 
    children, 
    onClick, 
    variant = 'primary', 
    size = 'md',
    disabled = false,
    className = ''
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline' | 'glass';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    className?: string;
  }) => {
    const baseClasses = "font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl backdrop-blur-sm";
    
    const variants = {
      primary: "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-blue-500/25",
      secondary: "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white shadow-gray-500/25",
      success: "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-green-500/25",
      danger: "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-red-500/25",
      outline: "border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white bg-white/10 backdrop-blur-sm",
      glass: "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20"
    };
    
    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg"
    };
    
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed transform-none' : ''} ${className}`}
      >
        {children}
      </button>
    );
  };

  const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-white/10 dark:bg-gray-800/50 backdrop-blur-md rounded-3xl shadow-2xl p-6 transition-all duration-300 hover:shadow-3xl border border-white/20 dark:border-gray-700/50 ${className}`}>
      {children}
    </div>
  );

  const renderNavigation = () => (
    <nav className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-md shadow-lg border-b border-white/20 dark:border-gray-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <GamepadIcon className="w-8 h-8 text-blue-400" />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">خمم فيها</h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-6 rtl:space-x-reverse">
            <button
              onClick={() => setCurrentPage('home')}
              className={`flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 rounded-xl transition-all duration-200 ${
                currentPage === 'home' 
                  ? 'bg-blue-500/20 text-blue-400 backdrop-blur-sm' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-white/10 backdrop-blur-sm'
              }`}
            >
              <Home className="w-5 h-5" />
              <span>الرئيسية</span>
            </button>
            
            <button
              onClick={() => setCurrentPage('individual')}
              className={`flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 rounded-xl transition-all duration-200 ${
                currentPage === 'individual' 
                  ? 'bg-blue-500/20 text-blue-400 backdrop-blur-sm' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-white/10 backdrop-blur-sm'
              }`}
            >
              <User className="w-5 h-5" />
              <span>ألعاب فردية</span>
            </button>
            
            <button
              onClick={() => setCurrentPage('group')}
              className={`flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 rounded-xl transition-all duration-200 ${
                currentPage === 'group' 
                  ? 'bg-blue-500/20 text-blue-400 backdrop-blur-sm' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-white/10 backdrop-blur-sm'
              }`}
            >
              <Users className="w-5 h-5" />
              <span>ألعاب جماعية</span>
            </button>
            
            <button
              onClick={() => setCurrentPage('leaderboard')}
              className={`flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 rounded-xl transition-all duration-200 ${
                currentPage === 'leaderboard' 
                  ? 'bg-blue-500/20 text-blue-400 backdrop-blur-sm' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-white/10 backdrop-blur-sm'
              }`}
            >
              <Trophy className="w-5 h-5" />
              <span>المتصدرين</span>
            </button>
            
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-white/10 backdrop-blur-sm transition-all duration-200"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile menu */}
          <div className="md:hidden flex items-center space-x-2 rtl:space-x-reverse">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-white/10 backdrop-blur-sm transition-all duration-200"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
        
        {/* Mobile navigation */}
        <div className="md:hidden pb-4">
          <div className="flex justify-around">
            <button
              onClick={() => setCurrentPage('home')}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-xl transition-all duration-200 ${
                currentPage === 'home' 
                  ? 'bg-blue-500/20 text-blue-400' 
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-xs">الرئيسية</span>
            </button>
            
            <button
              onClick={() => setCurrentPage('individual')}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-xl transition-all duration-200 ${
                currentPage === 'individual' 
                  ? 'bg-blue-500/20 text-blue-400' 
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-xs">فردية</span>
            </button>
            
            <button
              onClick={() => setCurrentPage('group')}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-xl transition-all duration-200 ${
                currentPage === 'group' 
                  ? 'bg-blue-500/20 text-blue-400' 
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              <Users className="w-5 h-5" />
              <span className="text-xs">جماعية</span>
            </button>
            
            <button
              onClick={() => setCurrentPage('leaderboard')}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-xl transition-all duration-200 ${
                currentPage === 'leaderboard' 
                  ? 'bg-blue-500/20 text-blue-400' 
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              <Trophy className="w-5 h-5" />
              <span className="text-xs">المتصدرين</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );

  const renderHomePage = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
          مرحباً بك في منصة الألعاب الذكية
        </h2>
        <p className="text-xl text-white/80 mb-8 drop-shadow-md">
          استمتع بمجموعة متنوعة من الألعاب الفردية والجماعية
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="text-center hover:scale-105 transition-transform duration-300">
          <User className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-4">ألعاب فردية</h3>
          <p className="text-white/70 mb-6">
            اختبر معلوماتك وذكاءك مع مجموعة من الأسئلة والتحديات المتنوعة
          </p>
          <Button onClick={() => setCurrentPage('individual')} size="lg" variant="glass">
            ابدأ اللعب
          </Button>
        </Card>
        
        <Card className="text-center hover:scale-105 transition-transform duration-300">
          <Users className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-4">ألعاب جماعية</h3>
          <p className="text-white/70 mb-6">
            العب مع الأصدقاء في ألعاب مثيرة مثل لعبة الذئب والقرية والأحرف الأولى
          </p>
          <Button onClick={() => setCurrentPage('group')} variant="success" size="lg">
            العب مع الأصدقاء
          </Button>
        </Card>
      </div>
    </div>
  );

  const renderIndividualGames = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-lg">الألعاب الفردية</h2>
        <p className="text-white/80 drop-shadow-md">اختبر معلوماتك وحقق أعلى النقاط</p>
      </div>
      
      {!gameStarted ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="text-center hover:scale-105 transition-transform duration-300">
            <BookOpen className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-3">لعبة الأسئلة</h3>
            <p className="text-white/70 mb-4 text-sm">
              أجب على الأسئلة واحصل على أعلى نقاط ممكنة
            </p>
            <Button onClick={() => startIndividualGame('quiz')} className="w-full">
              <Play className="w-4 h-4 ml-2" />
              ابدأ اللعبة
            </Button>
          </Card>

          <Card className="text-center hover:scale-105 transition-transform duration-300">
            <Calculator className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-3">لعبة الرياضيات</h3>
            <p className="text-white/70 mb-4 text-sm">
              حل المسائل الرياضية بأسرع وقت ممكن
            </p>
            <Button onClick={() => startIndividualGame('math')} variant="success" className="w-full">
              <Play className="w-4 h-4 ml-2" />
              ابدأ اللعبة
            </Button>
          </Card>

          <Card className="text-center hover:scale-105 transition-transform duration-300">
            <Brain className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-3">لعبة الذاكرة</h3>
            <p className="text-white/70 mb-4 text-sm">
              احفظ التسلسل وأعد تكراره بنفس الترتيب
            </p>
            <Button onClick={() => startIndividualGame('memory')} variant="outline" className="w-full">
              <Play className="w-4 h-4 ml-2" />
              ابدأ اللعبة
            </Button>
          </Card>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          {currentIndividualGame === 'quiz' && (
            <Card>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-white/70">
                    السؤال {currentQuestion + 1} من {questions.length}
                  </span>
                  <span className="text-sm font-medium text-blue-400">
                    النقاط: {score}
                  </span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3 backdrop-blur-sm">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-8 text-center">
                {questions[currentQuestion].text}
              </h3>
              
              <div className="grid gap-4">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showResult}
                    className={`p-4 rounded-2xl text-right transition-all duration-300 transform hover:scale-102 backdrop-blur-sm ${
                      showResult
                        ? index === questions[currentQuestion].correctAnswer
                          ? 'bg-green-500/30 border-2 border-green-400 text-green-100 shadow-green-500/25'
                          : selectedAnswer === index
                          ? 'bg-red-500/30 border-2 border-red-400 text-red-100 shadow-red-500/25'
                          : 'bg-white/10 text-white/50 border border-white/20'
                        : 'bg-white/10 hover:bg-white/20 border border-white/20 hover:border-blue-400/50 text-white hover:shadow-lg'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{option}</span>
                      {showResult && (
                        <span className="ml-2">
                          {index === questions[currentQuestion].correctAnswer ? (
                            <CheckCircle className="w-6 h-6 text-green-400" />
                          ) : selectedAnswer === index ? (
                            <XCircle className="w-6 h-6 text-red-400" />
                          ) : null}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          )}

          {currentIndividualGame === 'math' && (
            <Card>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-white/70">
                    السؤال {currentQuestion + 1} من {mathQuestions.length}
                  </span>
                  <span className="text-sm font-medium text-green-400">
                    النقاط: {score}
                  </span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3 backdrop-blur-sm">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestion + 1) / mathQuestions.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <h3 className="text-3xl font-bold text-white mb-8 text-center">
                {mathQuestions[currentQuestion].text}
              </h3>
              
              <div className="flex flex-col items-center space-y-6">
                <input
                  type="number"
                  value={mathAnswer}
                  onChange={(e) => setMathAnswer(e.target.value)}
                  placeholder="أدخل الإجابة"
                  className="w-full max-w-xs px-6 py-4 text-2xl text-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/50 focus:ring-2 focus:ring-green-400 focus:border-transparent"
                  disabled={showResult}
                  onKeyPress={(e) => e.key === 'Enter' && !showResult && mathAnswer && handleMathAnswer()}
                />
                
                {!showResult && (
                  <Button 
                    onClick={handleMathAnswer} 
                    disabled={!mathAnswer}
                    variant="success"
                    size="lg"
                  >
                    تأكيد الإجابة
                  </Button>
                )}
                
                {showResult && (
                  <div className={`text-center p-4 rounded-2xl backdrop-blur-sm ${
                    selectedAnswer === 1 
                      ? 'bg-green-500/20 border border-green-400/50' 
                      : 'bg-red-500/20 border border-red-400/50'
                  }`}>
                    <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                      {selectedAnswer === 1 ? (
                        <CheckCircle className="w-8 h-8 text-green-400" />
                      ) : (
                        <XCircle className="w-8 h-8 text-red-400" />
                      )}
                      <span className={`text-xl font-bold ${
                        selectedAnswer === 1 ? 'text-green-100' : 'text-red-100'
                      }`}>
                        {selectedAnswer === 1 ? 'إجابة صحيحة!' : `الإجابة الصحيحة: ${mathQuestions[currentQuestion].answer}`}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

          {currentIndividualGame === 'memory' && (
            <Card>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-white/70">
                    المستوى: {memoryLevel}
                  </span>
                  <span className="text-sm font-medium text-purple-400">
                    النقاط: {score}
                  </span>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-8 text-center">
                {showingSequence ? 'احفظ التسلسل...' : 'أعد التسلسل بنفس الترتيب'}
              </h3>
              
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                {[0, 1, 2, 3].map((colorIndex) => (
                  <button
                    key={colorIndex}
                    onClick={() => handleMemoryClick(colorIndex)}
                    className={`h-24 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                      showingSequence && memorySequence[Math.floor(Date.now() / 800) % memorySequence.length] === colorIndex
                        ? 'scale-110 shadow-2xl'
                        : ''
                    } ${
                      colorIndex === 0 ? 'bg-red-500 hover:bg-red-400' :
                      colorIndex === 1 ? 'bg-blue-500 hover:bg-blue-400' :
                      colorIndex === 2 ? 'bg-green-500 hover:bg-green-400' :
                      'bg-yellow-500 hover:bg-yellow-400'
                    }`}
                    disabled={showingSequence}
                  />
                ))}
              </div>
              
              {showResult && (
                <div className={`mt-6 text-center p-4 rounded-2xl backdrop-blur-sm ${
                  selectedAnswer === 1 
                    ? 'bg-green-500/20 border border-green-400/50' 
                    : 'bg-red-500/20 border border-red-400/50'
                }`}>
                  <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                    {selectedAnswer === 1 ? (
                      <CheckCircle className="w-8 h-8 text-green-400" />
                    ) : (
                      <XCircle className="w-8 h-8 text-red-400" />
                    )}
                    <span className={`text-xl font-bold ${
                      selectedAnswer === 1 ? 'text-green-100' : 'text-red-100'
                    }`}>
                      {selectedAnswer === 1 ? 'ممتاز! المستوى التالي...' : 'خطأ! حاول مرة أخرى'}
                    </span>
                  </div>
                </div>
              )}
            </Card>
          )}
        </div>
      )}
      
      {score > 0 && !gameStarted && (
        <Card className="max-w-md mx-auto text-center">
          <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">انتهت اللعبة!</h3>
          <p className="text-white/70 mb-4">
            نتيجتك النهائية: {score} من {
              currentIndividualGame === 'quiz' ? questions.length :
              currentIndividualGame === 'math' ? mathQuestions.length :
              memoryLevel - 1
            }
          </p>
          <Button onClick={() => setScore(0)} variant="glass">
            العب مرة أخرى
          </Button>
        </Card>
      )}
    </div>
  );

  const renderGroupGames = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-lg">الألعاب الجماعية</h2>
        <p className="text-white/80 drop-shadow-md">العب مع الأصدقاء واستمتع بوقتك</p>
      </div>
      
      {gamePhase === 'setup' && (
        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <h3 className="text-xl font-bold text-white mb-4">إضافة اللاعبين</h3>
            <div className="space-y-4">
              <div className="flex space-x-2 rtl:space-x-reverse">
                <input
                  type="text"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  placeholder="اسم اللاعب"
                  className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
                />
                <Button onClick={addPlayer} size="sm" variant="glass">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {players.map((player) => (
                  <div key={player.id} className="flex justify-between items-center p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                    <span className="font-medium text-white">{player.name}</span>
                    <button
                      onClick={() => removePlayer(player.id)}
                      className="text-red-400 hover:text-red-300 transition-colors p-1 rounded-lg hover:bg-red-500/20"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              
              <p className="text-sm text-white/70">
                عدد اللاعبين: {players.length}
              </p>
            </div>
          </Card>
          
          <Card>
            <h3 className="text-xl font-bold text-white mb-4">اختر اللعبة</h3>
            <div className="space-y-4">
              <div className="p-4 border border-white/20 rounded-xl bg-white/5 backdrop-blur-sm">
                <h4 className="font-bold text-white mb-2">لعبة الذئب والقرية</h4>
                <p className="text-sm text-white/70 mb-3">
                  لعبة استراتيجية مثيرة حيث يحاول الذئاب القضاء على القرويين
                </p>
                <p className="text-xs text-white/50 mb-3">
                  الحد الأدنى: 4 لاعبين
                </p>
                <Button 
                  onClick={startLoupGarou} 
                  disabled={players.length < 4}
                  className="w-full"
                  variant="glass"
                >
                  ابدأ اللعبة
                </Button>
              </div>
              
              <div className="p-4 border border-white/20 rounded-xl bg-white/5 backdrop-blur-sm">
                <h4 className="font-bold text-white mb-2">ماكش من الحومة</h4>
                <p className="text-sm text-white/70 mb-3">
                  لعبة ممتعة حيث يحاول اللاعبون اكتشاف من هو الغريب بينهم
                </p>
                <p className="text-xs text-white/50 mb-3">
                  الحد الأدنى: 3 لاعبين
                </p>
                <Button 
                  onClick={startMakeshGame} 
                  disabled={players.length < 3}
                  variant="success"
                  className="w-full"
                >
                  ابدأ اللعبة
                </Button>
              </div>

              <div className="p-4 border border-white/20 rounded-xl bg-white/5 backdrop-blur-sm">
                <h4 className="font-bold text-white mb-2">لعبة الأحرف الأولى</h4>
                <p className="text-sm text-white/70 mb-3">
                  اذكر كلمات تبدأ بحرف معين في فئات مختلفة (جماد، نبات، حيوان...)
                </p>
                <p className="text-xs text-white/50 mb-3">
                  الحد الأدنى: 2 لاعبين
                </p>
                <Button 
                  onClick={startLetterGame} 
                  disabled={players.length < 2}
                  variant="outline"
                  className="w-full"
                >
                  ابدأ اللعبة
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
      
      {gamePhase === 'playing' && (currentGame === 'loup-garou' || currentGame === 'makesh') && (
        <Card className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
            <h3 className="text-2xl font-bold text-white">
              {currentGame === 'loup-garou' ? 'لعبة الذئب والقرية' : 'ماكش من الحومة'}
            </h3>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Button onClick={() => setShowAllCards(!showAllCards)} variant="outline" size="sm">
                {showAllCards ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showAllCards ? 'إخفاء الكل' : 'عرض الكل'}
              </Button>
              <Button onClick={resetGame} variant="secondary" size="sm">
                <RotateCcw className="w-4 h-4 ml-2" />
                إعادة تشغيل
              </Button>
            </div>
          </div>
          
          {!showAllCards ? (
            <div className="text-center space-y-6">
              <div className="flex justify-center items-center space-x-4 rtl:space-x-reverse">
                <Button onClick={prevPlayer} variant="glass" size="sm">
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <span className="text-white font-medium">
                  {currentPlayerIndex + 1} من {players.length}
                </span>
                <Button onClick={nextPlayer} variant="glass" size="sm">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="max-w-sm mx-auto">
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                  <h4 className="text-2xl font-bold text-white mb-4">
                    {players[currentPlayerIndex]?.name}
                  </h4>
                  
                  {players[currentPlayerIndex]?.revealed ? (
                    <div className="space-y-4">
                      <div className={`px-4 py-2 rounded-xl text-lg font-bold ${
                        players[currentPlayerIndex]?.role === 'ذئب' || players[currentPlayerIndex]?.role === 'الغريب'
                          ? 'bg-red-500/30 text-red-100 border border-red-400/50'
                          : 'bg-blue-500/30 text-blue-100 border border-blue-400/50'
                      }`}>
                        {players[currentPlayerIndex]?.role}
                      </div>
                      <Button 
                        onClick={() => togglePlayerReveal(players[currentPlayerIndex].id)} 
                        variant="secondary" 
                        size="sm"
                      >
                        إخفاء الدور
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      onClick={() => togglePlayerReveal(players[currentPlayerIndex].id)} 
                      variant="glass"
                    >
                      اضغط لرؤية دورك
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {players.map((player) => (
                <div key={player.id} className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-white">{player.name}</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      player.role === 'ذئب' || player.role === 'الغريب'
                        ? 'bg-red-500/30 text-red-100 border border-red-400/50'
                        : 'bg-blue-500/30 text-blue-100 border border-blue-400/50'
                    }`}>
                      {player.role}
                    </span>
                  </div>
                  {currentGame === 'loup-garou' && (
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <div className={`w-3 h-3 rounded-full ${
                        player.isAlive ? 'bg-green-400' : 'bg-red-400'
                      }`}></div>
                      <span className="text-sm text-white/70">
                        {player.isAlive ? 'حي' : 'ميت'}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          <div className={`mt-6 p-4 rounded-2xl backdrop-blur-sm border ${
            currentGame === 'loup-garou' 
              ? 'bg-blue-500/20 border-blue-400/50' 
              : 'bg-green-500/20 border-green-400/50'
          }`}>
            <h4 className={`font-bold mb-2 ${
              currentGame === 'loup-garou' ? 'text-blue-100' : 'text-green-100'
            }`}>
              قواعد اللعبة:
            </h4>
            <ul className={`text-sm space-y-1 ${
              currentGame === 'loup-garou' ? 'text-blue-200' : 'text-green-200'
            }`}>
              {currentGame === 'loup-garou' ? (
                <>
                  <li>• الذئاب يحاولون القضاء على القرويين</li>
                  <li>• العراف يمكنه معرفة هوية لاعب واحد كل ليلة</li>
                  <li>• الطبيب يمكنه حماية لاعب واحد كل ليلة</li>
                  <li>• الهدف: القضاء على جميع الذئاب أو جميع القرويين</li>
                </>
              ) : (
                <>
                  <li>• هناك لاعب واحد "غريب" والباقي "من الحومة"</li>
                  <li>• الهدف: اكتشاف من هو الغريب</li>
                  <li>• الغريب يحاول أن يندمج مع المجموعة</li>
                  <li>• اللاعبون يصوتون لاختيار الغريب</li>
                </>
              )}
            </ul>
          </div>
        </Card>
      )}

      {gamePhase === 'playing' && currentGame === 'letters' && (
        <Card className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
            <h3 className="text-2xl font-bold text-white">لعبة الأحرف الأولى</h3>
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className={`px-4 py-2 rounded-xl font-bold ${
                gameTimer > 30 ? 'bg-green-500/30 text-green-100' :
                gameTimer > 10 ? 'bg-yellow-500/30 text-yellow-100' :
                'bg-red-500/30 text-red-100'
              }`}>
                {gameTimer}s
              </div>
              <Button onClick={resetGame} variant="secondary" size="sm">
                <RotateCcw className="w-4 h-4 ml-2" />
                إعادة تشغيل
              </Button>
            </div>
          </div>
          
          <div className="text-center space-y-6">
            <div className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 backdrop-blur-sm rounded-3xl p-8 border border-purple-400/50">
              <h4 className="text-4xl font-bold text-white mb-4">الحرف: {currentLetter}</h4>
              <h5 className="text-2xl font-semibold text-purple-100 mb-6">
                الفئة: {categories[currentCategory]}
              </h5>
              
              <div className="flex justify-center space-x-4 rtl:space-x-reverse">
                <Button 
                  onClick={() => setCurrentCategory((prev) => (prev + 1) % categories.length)}
                  variant="glass"
                >
                  الفئة التالية
                </Button>
                <Button 
                  onClick={() => {
                    const newLetter = arabicLetters[Math.floor(Math.random() * arabicLetters.length)];
                    setCurrentLetter(newLetter);
                    setGameTimer(60);
                  }}
                  variant="outline"
                >
                  <Shuffle className="w-4 h-4 ml-2" />
                  حرف جديد
                </Button>
                <Button 
                  onClick={() => setTimerActive(!timerActive)}
                  variant={timerActive ? "danger" : "success"}
                >
                  {timerActive ? 'إيقاف' : 'بدء'} المؤقت
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentCategory(index)}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    currentCategory === index
                      ? 'bg-purple-500/30 text-purple-100 border border-purple-400/50 scale-105'
                      : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/20'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-purple-500/20 rounded-2xl backdrop-blur-sm border border-purple-400/50">
            <h4 className="font-bold text-purple-100 mb-2">قواعد اللعبة:</h4>
            <ul className="text-sm text-purple-200 space-y-1">
              <li>• اذكر كلمة تبدأ بالحرف المحدد في الفئة المطلوبة</li>
              <li>• لا يمكن تكرار الكلمات</li>
              <li>• من لا يستطيع إيجاد كلمة يخرج من الجولة</li>
              <li>• الفائز هو آخر لاعب متبقي</li>
            </ul>
          </div>
        </Card>
      )}
    </div>
  );

  const renderLeaderboard = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-lg">المتصدرين</h2>
        <p className="text-white/80 drop-shadow-md">أفضل اللاعبين في المنصة</p>
      </div>
      
      <Card className="max-w-2xl mx-auto">
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">قريباً</h3>
          <p className="text-white/70">
            سيتم إضافة نظام المتصدرين قريباً لتتبع أفضل النتائج
          </p>
        </div>
      </Card>
    </div>
  );

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDarkMode 
        ? 'dark bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900' 
        : 'bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500'
    }`}>
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10">
        {renderNavigation()}
        
        <main className="max-w-7xl mx-auto px-4 py-8">
          {currentPage === 'home' && renderHomePage()}
          {currentPage === 'individual' && renderIndividualGames()}
          {currentPage === 'group' && renderGroupGames()}
          {currentPage === 'leaderboard' && renderLeaderboard()}
        </main>
      </div>
    </div>
  );
};

export default App;
