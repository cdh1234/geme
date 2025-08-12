import React, { useState, useEffect, useRef } from 'react';
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
  Minus,
  Grid3X3,
  Camera,
  Star,
  Award,
  Timer,
  Volume2,
  VolumeX,
  Sparkles,
  Target,
  Crown,
  Flame
} from 'lucide-react';

type GameType = 'individual' | 'group';
type Page = 'home' | 'individual' | 'group' | 'leaderboard' | 'settings';

interface Player {
  id: number;
  name: string;
  role?: string;
  isAlive?: boolean;
  revealed?: boolean;
  score?: number;
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

interface TicTacToeCell {
  value: 'X' | 'O' | null;
  isWinning?: boolean;
}

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
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
  const [gameTime, setGameTime] = useState(0);
  const [streak, setStreak] = useState(0);
  
  // Tic Tac Toe state
  const [ticTacToeBoard, setTicTacToeBoard] = useState<TicTacToeCell[]>(
    Array(9).fill({ value: null, isWinning: false })
  );
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [ticTacToeWinner, setTicTacToeWinner] = useState<'X' | 'O' | 'draw' | null>(null);
  const [ticTacToeScore, setTicTacToeScore] = useState({ X: 0, O: 0, draws: 0 });
  
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

  // Refs
  const playerInputRef = useRef<HTMLInputElement>(null);
  const gameTimerRef = useRef<NodeJS.Timeout>();

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
    },
    {
      id: 6,
      text: "ما هي أطول نهر في العالم؟",
      options: ["النيل", "الأمازون", "اليانغتسي", "المسيسيبي"],
      correctAnswer: 0
    },
    {
      id: 7,
      text: "كم عدد عظام جسم الإنسان البالغ؟",
      options: ["206", "208", "210", "212"],
      correctAnswer: 0
    },
    {
      id: 8,
      text: "ما هي أصغر دولة في العالم؟",
      options: ["موناكو", "الفاتيكان", "سان مارينو", "ليختنشتاين"],
      correctAnswer: 1
    }
  ];

  const mathQuestions: MathQuestion[] = [
    { id: 1, text: "15 + 27 = ?", answer: 42 },
    { id: 2, text: "8 × 9 = ?", answer: 72 },
    { id: 3, text: "144 ÷ 12 = ?", answer: 12 },
    { id: 4, text: "25² = ?", answer: 625 },
    { id: 5, text: "√64 = ?", answer: 8 },
    { id: 6, text: "13 × 7 = ?", answer: 91 },
    { id: 7, text: "256 ÷ 16 = ?", answer: 16 },
    { id: 8, text: "12² = ?", answer: 144 },
    { id: 9, text: "√121 = ?", answer: 11 },
    { id: 10, text: "45 + 67 = ?", answer: 112 }
  ];

  const memoryImages = [
    '🌟', '🎯', '🔥', '⚡', '🎨', '🎭', '🎪', '🎸', 
    '🌈', '🦋', '🌺', '🍀', '🎲', '💎', '🏆', '👑'
  ];

  const loupGarouRoles = [
    "ذئب", "قروي", "عراف", "طبيب", "صياد", "ساحرة", "حارس", "عمدة"
  ];

  const arabicLetters = [
    'أ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'
  ];

  // Game timer effect
  useEffect(() => {
    if (gameStarted && currentIndividualGame) {
      gameTimerRef.current = setInterval(() => {
        setGameTime(prev => prev + 1);
      }, 1000);
    } else {
      if (gameTimerRef.current) {
        clearInterval(gameTimerRef.current);
      }
    }

    return () => {
      if (gameTimerRef.current) {
        clearInterval(gameTimerRef.current);
      }
    };
  }, [gameStarted, currentIndividualGame]);

  // Timer effect for letter game
  useEffect(() => {
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

  // Sound effects
  const playSound = (type: 'success' | 'error' | 'click' | 'win') => {
    if (!soundEnabled) return;
    
    // Create audio context for sound effects
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch (type) {
      case 'success':
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
        break;
      case 'error':
        oscillator.frequency.setValueAtTime(220, audioContext.currentTime); // A3
        break;
      case 'click':
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        break;
      case 'win':
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
        oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
        break;
    }
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  // Tic Tac Toe functions
  const checkTicTacToeWinner = (board: TicTacToeCell[]): { winner: 'X' | 'O' | 'draw' | null, winningCells: number[] } => {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a].value && board[a].value === board[b].value && board[a].value === board[c].value) {
        return { winner: board[a].value, winningCells: pattern };
      }
    }

    if (board.every(cell => cell.value !== null)) {
      return { winner: 'draw', winningCells: [] };
    }

    return { winner: null, winningCells: [] };
  };

  const handleTicTacToeClick = (index: number) => {
    if (ticTacToeBoard[index].value || ticTacToeWinner) return;

    playSound('click');
    const newBoard = [...ticTacToeBoard];
    newBoard[index] = { value: currentPlayer, isWinning: false };
    setTicTacToeBoard(newBoard);

    const { winner, winningCells } = checkTicTacToeWinner(newBoard);
    
    if (winner) {
      if (winner !== 'draw') {
        playSound('win');
        // Highlight winning cells
        const finalBoard = newBoard.map((cell, i) => ({
          ...cell,
          isWinning: winningCells.includes(i)
        }));
        setTicTacToeBoard(finalBoard);
        setTicTacToeScore(prev => ({
          ...prev,
          [winner]: prev[winner] + 1
        }));
      } else {
        setTicTacToeScore(prev => ({
          ...prev,
          draws: prev.draws + 1
        }));
      }
      setTicTacToeWinner(winner);
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const resetTicTacToe = () => {
    setTicTacToeBoard(Array(9).fill({ value: null, isWinning: false }));
    setCurrentPlayer('X');
    setTicTacToeWinner(null);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    const isCorrect = answerIndex === questions[currentQuestion].correctAnswer;
    
    if (isCorrect) {
      setScore(score + 1);
      setStreak(streak + 1);
      playSound('success');
    } else {
      setStreak(0);
      playSound('error');
    }
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setGameStarted(false);
        setCurrentQuestion(0);
        playSound('win');
      }
    }, 2000);
  };

  const handleMathAnswer = () => {
    const userAnswer = parseInt(mathAnswer);
    const correct = userAnswer === mathQuestions[currentQuestion].answer;
    
    if (correct) {
      setScore(score + 1);
      setStreak(streak + 1);
      playSound('success');
    } else {
      setStreak(0);
      playSound('error');
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
        playSound('win');
      }
    }, 2000);
  };

  const generateMemorySequence = () => {
    const sequence = [];
    for (let i = 0; i < memoryLevel + 2; i++) {
      sequence.push(Math.floor(Math.random() * 8)); // 8 different images
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
      }, (index + 1) * 1000);
    });
  };

  const handleMemoryClick = (imageIndex: number) => {
    if (showingSequence) return;
    
    playSound('click');
    const newUserSequence = [...userSequence, imageIndex];
    setUserSequence(newUserSequence);
    
    // Check if sequence is correct so far
    const isCorrect = newUserSequence.every((image, index) => image === memorySequence[index]);
    
    if (!isCorrect) {
      // Wrong sequence
      setShowResult(true);
      setSelectedAnswer(0);
      setStreak(0);
      playSound('error');
      setTimeout(() => {
        setGameStarted(false);
        setMemoryLevel(1);
      }, 2000);
    } else if (newUserSequence.length === memorySequence.length) {
      // Correct complete sequence
      setScore(score + 1);
      setStreak(streak + 1);
      setMemoryLevel(memoryLevel + 1);
      setShowResult(true);
      setSelectedAnswer(1);
      playSound('success');
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
    setStreak(0);
    setGameTime(0);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setMathAnswer('');
    setMemoryLevel(1);
    
    if (gameType === 'memory') {
      generateMemorySequence();
    } else if (gameType === 'tic-tac-toe') {
      resetTicTacToe();
    }
  };

  const addPlayer = () => {
    const trimmedName = newPlayerName.trim();
    if (trimmedName && trimmedName.length >= 2) {
      setPlayers([...players, { 
        id: Date.now(), 
        name: trimmedName, 
        revealed: false,
        score: 0
      }]);
      setNewPlayerName('');
      playSound('success');
      
      // Focus back to input
      setTimeout(() => {
        if (playerInputRef.current) {
          playerInputRef.current.focus();
        }
      }, 100);
    }
  };

  const removePlayer = (id: number) => {
    setPlayers(players.filter(p => p.id !== id));
    playSound('click');
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
    playSound('success');
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
    playSound('success');
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
    playSound('success');
  };

  const nextPlayer = () => {
    if (currentPlayerIndex < players.length - 1) {
      setCurrentPlayerIndex(currentPlayerIndex + 1);
    } else {
      setCurrentPlayerIndex(0);
    }
    playSound('click');
  };

  const prevPlayer = () => {
    if (currentPlayerIndex > 0) {
      setCurrentPlayerIndex(currentPlayerIndex - 1);
    } else {
      setCurrentPlayerIndex(players.length - 1);
    }
    playSound('click');
  };

  const togglePlayerReveal = (playerId: number) => {
    setPlayers(players.map(player => 
      player.id === playerId 
        ? { ...player, revealed: !player.revealed }
        : player
    ));
    playSound('click');
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
    playSound('click');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const Button = ({ 
    children, 
    onClick, 
    variant = 'primary', 
    size = 'md',
    disabled = false,
    className = '',
    icon
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline' | 'glass' | 'gradient';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    disabled?: boolean;
    className?: string;
    icon?: React.ReactNode;
  }) => {
    const baseClasses = "font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl backdrop-blur-sm relative overflow-hidden";
    
    const variants = {
      primary: "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-blue-500/25",
      secondary: "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white shadow-gray-500/25",
      success: "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-green-500/25",
      danger: "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-red-500/25",
      outline: "border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white bg-white/10 backdrop-blur-sm",
      glass: "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20",
      gradient: "bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white shadow-purple-500/25"
    };
    
    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
      xl: "px-10 py-5 text-xl"
    };
    
    return (
      <button
        onClick={() => {
          if (onClick) {
            playSound('click');
            onClick();
          }
        }}
        disabled={disabled}
        className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed transform-none' : ''} ${className}`}
      >
        <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse relative z-10">
          {icon && <span>{icon}</span>}
          <span>{children}</span>
        </div>
        {!disabled && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        )}
      </button>
    );
  };

  const Card = ({ children, className = '', gradient = false }: { 
    children: React.ReactNode; 
    className?: string;
    gradient?: boolean;
  }) => (
    <div className={`${
      gradient 
        ? 'bg-gradient-to-br from-white/20 via-white/10 to-white/5' 
        : 'bg-white/10'
    } dark:bg-gray-800/50 backdrop-blur-md rounded-3xl shadow-2xl p-6 transition-all duration-300 hover:shadow-3xl border border-white/20 dark:border-gray-700/50 hover:border-white/30 ${className}`}>
      {children}
    </div>
  );

  const StatCard = ({ icon, title, value, color = 'blue' }: {
    icon: React.ReactNode;
    title: string;
    value: string | number;
    color?: string;
  }) => (
    <div className={`bg-gradient-to-br from-${color}-500/20 to-${color}-600/10 backdrop-blur-sm rounded-2xl p-4 border border-${color}-400/30`}>
      <div className="flex items-center space-x-3 rtl:space-x-reverse">
        <div className={`p-2 rounded-xl bg-${color}-500/20`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-white/70">{title}</p>
          <p className={`text-2xl font-bold text-${color}-300`}>{value}</p>
        </div>
      </div>
    </div>
  );

  const renderNavigation = () => (
    <nav className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-md shadow-lg border-b border-white/20 dark:border-gray-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="relative">
              <GamepadIcon className="w-8 h-8 text-blue-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-pulse"></div>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              خمم فيها
            </h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-6 rtl:space-x-reverse">
            <button
              onClick={() => setCurrentPage('home')}
              className={`flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 rounded-xl transition-all duration-200 ${
                currentPage === 'home' 
                  ? 'bg-blue-500/20 text-blue-400 backdrop-blur-sm shadow-lg' 
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
                  ? 'bg-blue-500/20 text-blue-400 backdrop-blur-sm shadow-lg' 
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
                  ? 'bg-blue-500/20 text-blue-400 backdrop-blur-sm shadow-lg' 
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
                  ? 'bg-blue-500/20 text-blue-400 backdrop-blur-sm shadow-lg' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-white/10 backdrop-blur-sm'
              }`}
            >
              <Trophy className="w-5 h-5" />
              <span>المتصدرين</span>
            </button>
            
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-white/10 backdrop-blur-sm transition-all duration-200"
              >
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
              
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-white/10 backdrop-blur-sm transition-all duration-200"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          <div className="md:hidden flex items-center space-x-2 rtl:space-x-reverse">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-white/10 backdrop-blur-sm transition-all duration-200"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-white/10 backdrop-blur-sm transition-all duration-200"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
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
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-3xl blur-3xl"></div>
        <div className="relative z-10 p-8">
          <h2 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6 drop-shadow-lg">
            مرحباً بك في منصة الألعاب الذكية
          </h2>
          <p className="text-xl md:text-2xl text-white/80 mb-8 drop-shadow-md max-w-3xl mx-auto">
            استمتع بمجموعة متنوعة من الألعاب الفردية والجماعية المصممة لتحدي ذكائك وإمتاعك
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              onClick={() => setCurrentPage('individual')} 
              variant="gradient" 
              size="xl"
              icon={<Sparkles className="w-6 h-6" />}
            >
              ابدأ اللعب الآن
            </Button>
            <Button 
              onClick={() => setCurrentPage('group')} 
              variant="glass" 
              size="xl"
              icon={<Users className="w-6 h-6" />}
            >
              العب مع الأصدقاء
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          icon={<GamepadIcon className="w-6 h-6 text-blue-400" />}
          title="إجمالي الألعاب"
          value="6+"
          color="blue"
        />
        <StatCard 
          icon={<Users className="w-6 h-6 text-green-400" />}
          title="ألعاب جماعية"
          value="3"
          color="green"
        />
        <StatCard 
          icon={<User className="w-6 h-6 text-purple-400" />}
          title="ألعاب فردية"
          value="4"
          color="purple"
        />
        <StatCard 
          icon={<Trophy className="w-6 h-6 text-yellow-400" />}
          title="التحديات"
          value="∞"
          color="yellow"
        />
      </div>
      
      {/* Game Categories */}
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="text-center hover:scale-105 transition-transform duration-300 group" gradient>
          <div className="relative">
            <User className="w-20 h-20 text-blue-400 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <h3 className="text-3xl font-bold text-white mb-4">ألعاب فردية</h3>
          <p className="text-white/70 mb-6 text-lg leading-relaxed">
            اختبر معلوماتك وذكاءك مع مجموعة من الأسئلة والتحديات المتنوعة. من الأسئلة العامة إلى الرياضيات وألعاب الذاكرة
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">أسئلة عامة</span>
            <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">رياضيات</span>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">ذاكرة</span>
            <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm">X/O</span>
          </div>
          <Button 
            onClick={() => setCurrentPage('individual')} 
            size="lg" 
            variant="glass"
            icon={<Play className="w-5 h-5" />}
          >
            ابدأ اللعب
          </Button>
        </Card>
        
        <Card className="text-center hover:scale-105 transition-transform duration-300 group" gradient>
          <div className="relative">
            <Users className="w-20 h-20 text-green-400 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute inset-0 bg-green-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <h3 className="text-3xl font-bold text-white mb-4">ألعاب جماعية</h3>
          <p className="text-white/70 mb-6 text-lg leading-relaxed">
            العب مع الأصدقاء في ألعاب مثيرة مثل لعبة الذئب والقرية، ماكش من الحومة، ولعبة الأحرف الأولى
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm">الذئب والقرية</span>
            <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm">ماكش من الحومة</span>
            <span className="px-3 py-1 bg-pink-500/20 text-pink-300 rounded-full text-sm">الأحرف الأولى</span>
          </div>
          <Button 
            onClick={() => setCurrentPage('group')} 
            variant="success" 
            size="lg"
            icon={<Users className="w-5 h-5" />}
          >
            العب مع الأصدقاء
          </Button>
        </Card>
      </div>

      {/* Features Section */}
      <Card className="text-center" gradient>
        <h3 className="text-3xl font-bold text-white mb-8">مميزات المنصة</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-white/5 rounded-2xl backdrop-blur-sm">
            <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h4 className="text-xl font-bold text-white mb-2">سريع ومتجاوب</h4>
            <p className="text-white/70">تجربة لعب سلسة وسريعة على جميع الأجهزة</p>
          </div>
          <div className="p-6 bg-white/5 rounded-2xl backdrop-blur-sm">
            <Brain className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h4 className="text-xl font-bold text-white mb-2">تحدي الذكاء</h4>
            <p className="text-white/70">ألعاب مصممة لتحفيز التفكير وتطوير المهارات</p>
          </div>
          <div className="p-6 bg-white/5 rounded-2xl backdrop-blur-sm">
            <Crown className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h4 className="text-xl font-bold text-white mb-2">تجربة مميزة</h4>
            <p className="text-white/70">تصميم عصري وتأثيرات بصرية رائعة</p>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderIndividualGames = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4 drop-shadow-lg">
          الألعاب الفردية
        </h2>
        <p className="text-white/80 drop-shadow-md text-lg">اختبر معلوماتك وحقق أعلى النقاط</p>
      </div>
      
      {!gameStarted ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center hover:scale-105 transition-transform duration-300 group" gradient>
            <BookOpen className="w-16 h-16 text-blue-400 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
            <h3 className="text-xl font-bold text-white mb-3">لعبة الأسئلة</h3>
            <p className="text-white/70 mb-4 text-sm">
              أجب على الأسئلة واحصل على أعلى نقاط ممكنة
            </p>
            <div className="mb-4">
              <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs">
                {questions.length} سؤال
              </span>
            </div>
            <Button 
              onClick={() => startIndividualGame('quiz')} 
              className="w-full"
              icon={<Play className="w-4 h-4" />}
            >
              ابدأ اللعبة
            </Button>
          </Card>

          <Card className="text-center hover:scale-105 transition-transform duration-300 group" gradient>
            <Calculator className="w-16 h-16 text-green-400 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
            <h3 className="text-xl font-bold text-white mb-3">لعبة الرياضيات</h3>
            <p className="text-white/70 mb-4 text-sm">
              حل المسائل الرياضية بأسرع وقت ممكن
            </p>
            <div className="mb-4">
              <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs">
                {mathQuestions.length} مسألة
              </span>
            </div>
            <Button 
              onClick={() => startIndividualGame('math')} 
              variant="success" 
              className="w-full"
              icon={<Play className="w-4 h-4" />}
            >
              ابدأ اللعبة
            </Button>
          </Card>

          <Card className="text-center hover:scale-105 transition-transform duration-300 group" gradient>
            <Camera className="w-16 h-16 text-purple-400 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
            <h3 className="text-xl font-bold text-white mb-3">لعبة الذاكرة</h3>
            <p className="text-white/70 mb-4 text-sm">
              احفظ التسلسل وأعد تكراره بنفس الترتيب
            </p>
            <div className="mb-4">
              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                مستويات لا نهائية
              </span>
            </div>
            <Button 
              onClick={() => startIndividualGame('memory')} 
              variant="outline" 
              className="w-full"
              icon={<Play className="w-4 h-4" />}
            >
              ابدأ اللعبة
            </Button>
          </Card>

          <Card className="text-center hover:scale-105 transition-transform duration-300 group" gradient>
            <Grid3X3 className="w-16 h-16 text-red-400 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
            <h3 className="text-xl font-bold text-white mb-3">لعبة X/O</h3>
            <p className="text-white/70 mb-4 text-sm">
              اللعبة الكلاسيكية المحبوبة للجميع
            </p>
            <div className="mb-4">
              <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-xs">
                لاعب ضد الكمبيوتر
              </span>
            </div>
            <Button 
              onClick={() => startIndividualGame('tic-tac-toe')} 
              variant="danger" 
              className="w-full"
              icon={<Play className="w-4 h-4" />}
            >
              ابدأ اللعبة
            </Button>
          </Card>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          {/* Game Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard 
              icon={<Target className="w-5 h-5 text-blue-400" />}
              title="النقاط"
              value={score}
              color="blue"
            />
            <StatCard 
              icon={<Flame className="w-5 h-5 text-red-400" />}
              title="السلسلة"
              value={streak}
              color="red"
            />
            <StatCard 
              icon={<Timer className="w-5 h-5 text-green-400" />}
              title="الوقت"
              value={formatTime(gameTime)}
              color="green"
            />
            <StatCard 
              icon={<Award className="w-5 h-5 text-purple-400" />}
              title="المستوى"
              value={currentIndividualGame === 'memory' ? memoryLevel : currentQuestion + 1}
              color="purple"
            />
          </div>

          {currentIndividualGame === 'quiz' && (
            <Card gradient>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-white/70">
                    السؤال {currentQuestion + 1} من {questions.length}
                  </span>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    {streak > 0 && (
                      <div className="flex items-center space-x-1 rtl:space-x-reverse px-3 py-1 bg-red-500/20 rounded-full">
                        <Flame className="w-4 h-4 text-red-400" />
                        <span className="text-red-300 text-sm font-bold">{streak}</span>
                      </div>
                    )}
                    <span className="text-sm font-medium text-blue-400">
                      النقاط: {score}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3 backdrop-blur-sm">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
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
                          ? 'bg-green-500/30 border-2 border-green-400 text-green-100 shadow-green-500/25 scale-105'
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
            <Card gradient>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-white/70">
                    السؤال {currentQuestion + 1} من {mathQuestions.length}
                  </span>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    {streak > 0 && (
                      <div className="flex items-center space-x-1 rtl:space-x-reverse px-3 py-1 bg-red-500/20 rounded-full">
                        <Flame className="w-4 h-4 text-red-400" />
                        <span className="text-red-300 text-sm font-bold">{streak}</span>
                      </div>
                    )}
                    <span className="text-sm font-medium text-green-400">
                      النقاط: {score}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3 backdrop-blur-sm">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestion + 1) / mathQuestions.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <h3 className="text-4xl md:text-5xl font-bold text-white mb-8 text-center">
                {mathQuestions[currentQuestion].text}
              </h3>
              
              <div className="flex flex-col items-center space-y-6">
                <input
                  type="number"
                  value={mathAnswer}
                  onChange={(e) => setMathAnswer(e.target.value)}
                  placeholder="أدخل الإجابة"
                  className="w-full max-w-xs px-6 py-4 text-2xl text-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/50 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300"
                  disabled={showResult}
                  onKeyPress={(e) => e.key === 'Enter' && !showResult && mathAnswer && handleMathAnswer()}
                />
                
                {!showResult && (
                  <Button 
                    onClick={handleMathAnswer} 
                    disabled={!mathAnswer}
                    variant="success"
                    size="lg"
                    icon={<CheckCircle className="w-5 h-5" />}
                  >
                    تأكيد الإجابة
                  </Button>
                )}
                
                {showResult && (
                  <div className={`text-center p-6 rounded-2xl backdrop-blur-sm border-2 transition-all duration-300 ${
                    selectedAnswer === 1 
                      ? 'bg-green-500/20 border-green-400/50 scale-105' 
                      : 'bg-red-500/20 border-red-400/50'
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
            <Card gradient>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-white/70">
                    المستوى: {memoryLevel}
                  </span>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    {streak > 0 && (
                      <div className="flex items-center space-x-1 rtl:space-x-reverse px-3 py-1 bg-red-500/20 rounded-full">
                        <Flame className="w-4 h-4 text-red-400" />
                        <span className="text-red-300 text-sm font-bold">{streak}</span>
                      </div>
                    )}
                    <span className="text-sm font-medium text-purple-400">
                      النقاط: {score}
                    </span>
                  </div>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-8 text-center">
                {showingSequence ? 'احفظ التسلسل...' : 'أعد التسلسل بنفس الترتيب'}
              </h3>
              
              <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
                {memoryImages.slice(0, 8).map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => handleMemoryClick(index)}
                    className={`h-20 md:h-24 rounded-2xl text-4xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border-2 ${
                      showingSequence && memorySequence[Math.floor(Date.now() / 1000) % memorySequence.length] === index
                        ? 'scale-110 shadow-2xl border-purple-400 bg-purple-500/30'
                        : 'border-white/20 bg-white/10 hover:bg-white/20 hover:border-purple-400/50'
                    }`}
                    disabled={showingSequence}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              
              {showResult && (
                <div className={`mt-6 text-center p-6 rounded-2xl backdrop-blur-sm border-2 transition-all duration-300 ${
                  selectedAnswer === 1 
                    ? 'bg-green-500/20 border-green-400/50 scale-105' 
                    : 'bg-red-500/20 border-red-400/50'
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

          {currentIndividualGame === 'tic-tac-toe' && (
            <Card gradient>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-4">لعبة X/O</h3>
                <div className="flex justify-center items-center space-x-8 rtl:space-x-reverse mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">X</div>
                    <div className="text-sm text-white/70">أنت</div>
                    <div className="text-lg font-bold text-blue-300">{ticTacToeScore.X}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg text-white/70">التعادل</div>
                    <div className="text-lg font-bold text-gray-300">{ticTacToeScore.draws}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-400">O</div>
                    <div className="text-sm text-white/70">الكمبيوتر</div>
                    <div className="text-lg font-bold text-red-300">{ticTacToeScore.O}</div>
                  </div>
                </div>
                
                {ticTacToeWinner && (
                  <div className={`p-4 rounded-2xl mb-4 ${
                    ticTacToeWinner === 'draw' 
                      ? 'bg-gray-500/20 border border-gray-400/50' 
                      : ticTacToeWinner === 'X'
                      ? 'bg-blue-500/20 border border-blue-400/50'
                      : 'bg-red-500/20 border border-red-400/50'
                  }`}>
                    <span className={`text-xl font-bold ${
                      ticTacToeWinner === 'draw' 
                        ? 'text-gray-100' 
                        : ticTacToeWinner === 'X'
                        ? 'text-blue-100'
                        : 'text-red-100'
                    }`}>
                      {ticTacToeWinner === 'draw' 
                        ? 'تعادل!' 
                        : ticTacToeWinner === 'X'
                        ? 'فزت! 🎉'
                        : 'فاز الكمبيوتر! 🤖'
                      }
                    </span>
                  </div>
                )}
                
                <div className="text-sm text-white/70 mb-4">
                  {!ticTacToeWinner && `دور: ${currentPlayer === 'X' ? 'أنت (X)' : 'الكمبيوتر (O)'}`}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto mb-6">
                {ticTacToeBoard.map((cell, index) => (
                  <button
                    key={index}
                    onClick={() => handleTicTacToeClick(index)}
                    className={`h-20 rounded-2xl text-3xl font-bold transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border-2 ${
                      cell.isWinning
                        ? 'bg-green-500/30 border-green-400 shadow-green-500/25 scale-110'
                        : cell.value
                        ? 'bg-white/20 border-white/30'
                        : 'bg-white/10 border-white/20 hover:bg-white/20 hover:border-blue-400/50'
                    } ${
                      cell.value === 'X' ? 'text-blue-400' : cell.value === 'O' ? 'text-red-400' : 'text-white/50'
                    }`}
                    disabled={!!cell.value || !!ticTacToeWinner}
                  >
                    {cell.value}
                  </button>
                ))}
              </div>
              
              <div className="text-center">
                <Button 
                  onClick={resetTicTacToe} 
                  variant="glass"
                  icon={<RotateCcw className="w-4 h-4" />}
                >
                  لعبة جديدة
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}
      
      {score > 0 && !gameStarted && (
        <Card className="max-w-md mx-auto text-center" gradient>
          <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-3xl font-bold text-white mb-2">انتهت اللعبة!</h3>
          <div className="space-y-2 mb-6">
            <p className="text-white/70 text-lg">
              نتيجتك النهائية: <span className="font-bold text-yellow-300">{score}</span> من {
                currentIndividualGame === 'quiz' ? questions.length :
                currentIndividualGame === 'math' ? mathQuestions.length :
                memoryLevel - 1
              }
            </p>
            <p className="text-white/70">
              الوقت المستغرق: <span className="font-bold text-blue-300">{formatTime(gameTime)}</span>
            </p>
            {streak > 1 && (
              <p className="text-white/70">
                أفضل سلسلة: <span className="font-bold text-red-300">{streak}</span>
              </p>
            )}
          </div>
          <Button 
            onClick={() => {
              setScore(0);
              setStreak(0);
              setGameTime(0);
            }} 
            variant="gradient"
            icon={<Play className="w-5 h-5" />}
          >
            العب مرة أخرى
          </Button>
        </Card>
      )}
    </div>
  );

  const renderGroupGames = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-4 drop-shadow-lg">
          الألعاب الجماعية
        </h2>
        <p className="text-white/80 drop-shadow-md text-lg">العب مع الأصدقاء واستمتع بوقتك</p>
      </div>
      
      {gamePhase === 'setup' && (
        <div className="grid lg:grid-cols-2 gap-8">
          <Card gradient>
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Users className="w-6 h-6 ml-2" />
              إضافة اللاعبين
            </h3>
            <div className="space-y-4">
              <div className="flex space-x-2 rtl:space-x-reverse">
                <input
                  ref={playerInputRef}
                  type="text"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  placeholder="اسم اللاعب (على الأقل حرفين)"
                  className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                  onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
                  minLength={2}
                />
                <Button 
                  onClick={addPlayer} 
                  size="sm" 
                  variant="glass"
                  disabled={newPlayerName.trim().length < 2}
                  icon={<Plus className="w-4 h-4" />}
                >
                  إضافة
                </Button>
              </div>
              
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {players.map((player, index) => (
                  <div key={player.id} className="flex justify-between items-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/15 transition-all duration-300">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <span className="font-medium text-white">{player.name}</span>
                    </div>
                    <button
                      onClick={() => removePlayer(player.id)}
                      className="text-red-400 hover:text-red-300 transition-colors p-2 rounded-lg hover:bg-red-500/20"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-500/20 rounded-xl border border-blue-400/30">
                <span className="text-sm text-blue-200">عدد اللاعبين:</span>
                <span className="text-lg font-bold text-blue-300">{players.length}</span>
              </div>
            </div>
          </Card>
          
          <Card gradient>
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <GamepadIcon className="w-6 h-6 ml-2" />
              اختر اللعبة
            </h3>
            <div className="space-y-4">
              <div className="p-6 border border-white/20 rounded-2xl bg-gradient-to-br from-red-500/20 to-pink-500/10 backdrop-blur-sm hover:from-red-500/30 hover:to-pink-500/20 transition-all duration-300">
                <div className="flex items-center mb-3">
                  <Crown className="w-6 h-6 text-red-400 ml-2" />
                  <h4 className="font-bold text-white text-lg">لعبة الذئب والقرية</h4>
                </div>
                <p className="text-sm text-white/70 mb-3">
                  لعبة استراتيجية مثيرة حيث يحاول الذئاب القضاء على القرويين
                </p>
                <p className="text-xs text-red-300 mb-4 flex items-center">
                  <Users className="w-4 h-4 ml-1" />
                  الحد الأدنى: 4 لاعبين
                </p>
                <Button 
                  onClick={startLoupGarou} 
                  disabled={players.length < 4}
                  className="w-full"
                  variant="glass"
                  icon={<Play className="w-4 h-4" />}
                >
                  ابدأ اللعبة
                </Button>
              </div>
              
              <div className="p-6 border border-white/20 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/10 backdrop-blur-sm hover:from-yellow-500/30 hover:to-orange-500/20 transition-all duration-300">
                <div className="flex items-center mb-3">
                  <Eye className="w-6 h-6 text-yellow-400 ml-2" />
                  <h4 className="font-bold text-white text-lg">ماكش من الحومة</h4>
                </div>
                <p className="text-sm text-white/70 mb-3">
                  لعبة ممتعة حيث يحاول اللاعبون اكتشاف من هو الغريب بينهم
                </p>
                <p className="text-xs text-yellow-300 mb-4 flex items-center">
                  <Users className="w-4 h-4 ml-1" />
                  الحد الأدنى: 3 لاعبين
                </p>
                <Button 
                  onClick={startMakeshGame} 
                  disabled={players.length < 3}
                  variant="success"
                  className="w-full"
                  icon={<Play className="w-4 h-4" />}
                >
                  ابدأ اللعبة
                </Button>
              </div>

              <div className="p-6 border border-white/20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/10 backdrop-blur-sm hover:from-purple-500/30 hover:to-blue-500/20 transition-all duration-300">
                <div className="flex items-center mb-3">
                  <BookOpen className="w-6 h-6 text-purple-400 ml-2" />
                  <h4 className="font-bold text-white text-lg">لعبة الأحرف الأولى</h4>
                </div>
                <p className="text-sm text-white/70 mb-3">
                  اذكر كلمات تبدأ بحرف معين في فئات مختلفة (جماد، نبات، حيوان...)
                </p>
                <p className="text-xs text-purple-300 mb-4 flex items-center">
                  <Users className="w-4 h-4 ml-1" />
                  الحد الأدنى: 2 لاعبين
                </p>
                <Button 
                  onClick={startLetterGame} 
                  disabled={players.length < 2}
                  variant="outline"
                  className="w-full"
                  icon={<Play className="w-4 h-4" />}
                >
                  ابدأ اللعبة
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
      
      {gamePhase === 'playing' && (currentGame === 'loup-garou' || currentGame === 'makesh') && (
        <Card className="max-w-4xl mx-auto" gradient>
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
            <h3 className="text-3xl font-bold text-white">
              {currentGame === 'loup-garou' ? 'لعبة الذئب والقرية' : 'ماكش من الحومة'}
            </h3>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Button 
                onClick={() => setShowAllCards(!showAllCards)} 
                variant="outline" 
                size="sm"
                icon={showAllCards ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              >
                {showAllCards ? 'إخفاء الكل' : 'عرض الكل'}
              </Button>
              <Button 
                onClick={resetGame} 
                variant="secondary" 
                size="sm"
                icon={<RotateCcw className="w-4 h-4" />}
              >
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
                <span className="text-white font-medium px-4 py-2 bg-white/10 rounded-xl backdrop-blur-sm">
                  {currentPlayerIndex + 1} من {players.length}
                </span>
                <Button onClick={nextPlayer} variant="glass" size="sm">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="max-w-sm mx-auto">
                <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
                  <h4 className="text-3xl font-bold text-white mb-6">
                    {players[currentPlayerIndex]?.name}
                  </h4>
                  
                  {players[currentPlayerIndex]?.revealed ? (
                    <div className="space-y-4">
                      <div className={`px-6 py-4 rounded-2xl text-xl font-bold border-2 ${
                        players[currentPlayerIndex]?.role === 'ذئب' || players[currentPlayerIndex]?.role === 'الغريب'
                          ? 'bg-red-500/30 text-red-100 border-red-400/50'
                          : 'bg-blue-500/30 text-blue-100 border-blue-400/50'
                      }`}>
                        {players[currentPlayerIndex]?.role}
                      </div>
                      <Button 
                        onClick={() => togglePlayerReveal(players[currentPlayerIndex].id)} 
                        variant="secondary" 
                        size="sm"
                        icon={<EyeOff className="w-4 h-4" />}
                      >
                        إخفاء الدور
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      onClick={() => togglePlayerReveal(players[currentPlayerIndex].id)} 
                      variant="glass"
                      size="lg"
                      icon={<Eye className="w-4 h-4" />}
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
                <div key={player.id} className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-white">{player.name}</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                      player.role === 'ذئب' || player.role === 'الغريب'
                        ? 'bg-red-500/30 text-red-100 border-red-400/50'
                        : 'bg-blue-500/30 text-blue-100 border-blue-400/50'
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
          
          <div className={`mt-8 p-6 rounded-2xl backdrop-blur-sm border ${
            currentGame === 'loup-garou' 
              ? 'bg-blue-500/20 border-blue-400/50' 
              : 'bg-green-500/20 border-green-400/50'
          }`}>
            <h4 className={`font-bold mb-3 text-xl ${
              currentGame === 'loup-garou' ? 'text-blue-100' : 'text-green-100'
            }`}>
              قواعد اللعبة:
            </h4>
            <ul className={`text-sm space-y-2 ${
              currentGame === 'loup-garou' ? 'text-blue-200' : 'text-green-200'
            }`}>
              {currentGame === 'loup-garou' ? (
                <>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-current rounded-full ml-2"></span>
                    الذئاب يحاولون القضاء على القرويين
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-current rounded-full ml-2"></span>
                    العراف يمكنه معرفة هوية لاعب واحد كل ليلة
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-current rounded-full ml-2"></span>
                    الطبيب يمكنه حماية لاعب واحد كل ليلة
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-current rounded-full ml-2"></span>
                    الهدف: القضاء على جميع الذئاب أو جميع القرويين
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-current rounded-full ml-2"></span>
                    هناك لاعب واحد "غريب\" والباقي "من الحومة"
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-current rounded-full ml-2"></span>
                    الهدف: اكتشاف من هو الغريب
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-current rounded-full ml-2"></span>
                    الغريب يحاول أن يندمج مع المجموعة
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-current rounded-full ml-2"></span>
                    اللاعبون يصوتون لاختيار الغريب
                  </li>
                </>
              )}
            </ul>
          </div>
        </Card>
      )}

      {gamePhase === 'playing' && currentGame === 'letters' && (
        <Card className="max-w-4xl mx-auto" gradient>
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
            <h3 className="text-3xl font-bold text-white">لعبة الأحرف الأولى</h3>
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className={`px-4 py-2 rounded-xl font-bold text-lg border-2 ${
                gameTimer > 30 ? 'bg-green-500/30 text-green-100 border-green-400/50' :
                gameTimer > 10 ? 'bg-yellow-500/30 text-yellow-100 border-yellow-400/50' :
                'bg-red-500/30 text-red-100 border-red-400/50'
              }`}>
                <Timer className="w-5 h-5 inline ml-1" />
                {gameTimer}s
              </div>
              <Button 
                onClick={resetGame} 
                variant="secondary" 
                size="sm"
                icon={<RotateCcw className="w-4 h-4" />}
              >
                إعادة تشغيل
              </Button>
            </div>
          </div>
          
          <div className="text-center space-y-8">
            <div className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 backdrop-blur-sm rounded-3xl p-8 border border-purple-400/50">
              <h4 className="text-6xl font-bold text-white mb-4">{currentLetter}</h4>
              <h5 className="text-3xl font-semibold text-purple-100 mb-6">
                الفئة: {categories[currentCategory]}
              </h5>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  onClick={() => setCurrentCategory((prev) => (prev + 1) % categories.length)}
                  variant="glass"
                  icon={<ArrowLeft className="w-4 h-4" />}
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
                  icon={<Shuffle className="w-4 h-4" />}
                >
                  حرف جديد
                </Button>
                <Button 
                  onClick={() => setTimerActive(!timerActive)}
                  variant={timerActive ? "danger" : "success"}
                  icon={timerActive ? <XCircle className="w-4 h-4" /> : <Play className="w-4 h-4" />}
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
                  className={`p-4 rounded-2xl transition-all duration-300 border-2 ${
                    currentCategory === index
                      ? 'bg-purple-500/30 text-purple-100 border-purple-400/50 scale-105 shadow-lg'
                      : 'bg-white/10 text-white/70 border-white/20 hover:bg-white/20 hover:border-purple-400/30'
                  }`}
                >
                  <span className="font-medium">{category}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="mt-8 p-6 bg-purple-500/20 rounded-2xl backdrop-blur-sm border border-purple-400/50">
            <h4 className="font-bold text-purple-100 mb-3 text-xl">قواعد اللعبة:</h4>
            <ul className="text-sm text-purple-200 space-y-2">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-current rounded-full ml-2"></span>
                اذكر كلمة تبدأ بالحرف المحدد في الفئة المطلوبة
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-current rounded-full ml-2"></span>
                لا يمكن تكرار الكلمات
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-current rounded-full ml-2"></span>
                من لا يستطيع إيجاد كلمة يخرج من الجولة
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-current rounded-full ml-2"></span>
                الفائز هو آخر لاعب متبقي
              </li>
            </ul>
          </div>
        </Card>
      )}
    </div>
  );

  const renderLeaderboard = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-4 drop-shadow-lg">
          المتصدرين
        </h2>
        <p className="text-white/80 drop-shadow-md text-lg">أفضل اللاعبين في المنصة</p>
      </div>
      
      <Card className="max-w-2xl mx-auto text-center" gradient>
        <div className="py-16">
          <div className="relative mb-6">
            <Trophy className="w-24 h-24 text-yellow-400 mx-auto" />
            <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-2xl"></div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">قريباً</h3>
          <p className="text-white/70 text-lg leading-relaxed max-w-md mx-auto">
            سيتم إضافة نظام المتصدرين قريباً لتتبع أفضل النتائج والإنجازات. 
            ستتمكن من مقارنة نتائجك مع اللاعبين الآخرين والتنافس للوصول إلى القمة!
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="p-4 bg-yellow-500/20 rounded-2xl border border-yellow-400/30">
              <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-yellow-300 font-bold">المركز الأول</p>
            </div>
            <div className="p-4 bg-gray-500/20 rounded-2xl border border-gray-400/30">
              <Award className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-300 font-bold">المركز الثاني</p>
            </div>
            <div className="p-4 bg-orange-500/20 rounded-2xl border border-orange-400/30">
              <Trophy className="w-8 h-8 text-orange-400 mx-auto mb-2" />
              <p className="text-orange-300 font-bold">المركز الثالث</p>
            </div>
          </div>
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
        <div className="absolute top-20 left-20 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl animate-bounce"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-yellow-500/10 rounded-full blur-2xl animate-bounce delay-700"></div>
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
