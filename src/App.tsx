import React, { useState, useEffect } from 'react';
import { Brain, Users, User, Trophy, Star, Play, Home, GamepadIcon, Lightbulb, Medal, Eye, EyeOff, MessageCircle, HelpCircle, CheckCircle, Shuffle, Clock, Target, Zap, Heart, RefreshCw, ArrowRight, ArrowLeft, Settings } from 'lucide-react';

// Game Components
const GameCard = ({ title, description, icon: Icon, players, difficulty, onClick, featured = false, category }) => (
  <div 
    className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
      featured 
        ? 'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 md:col-span-2' 
        : category === 'single'
        ? 'bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600'
        : 'bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600'
    }`}
    onClick={onClick}
  >
    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300"></div>
    <div className="relative p-4 md:p-8 text-white">
      <div className="flex items-center gap-2 md:gap-4 mb-3 md:mb-4">
        <div className={`p-2 md:p-3 rounded-xl bg-white/20 backdrop-blur-sm ${featured ? 'animate-pulse' : ''}`}>
          <Icon size={window.innerWidth < 768 ? 24 : 32} />
        </div>
        {featured && (
          <div className="bg-white/20 backdrop-blur-sm px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-bold animate-bounce">
            مميز ⭐
          </div>
        )}
        <div className="bg-white/20 backdrop-blur-sm px-2 md:px-3 py-1 rounded-full text-xs">
          {category === 'single' ? '👤 فردي' : '👥 جماعي'}
        </div>
      </div>
      <h3 className="text-lg md:text-2xl font-bold mb-2 md:mb-3">{title}</h3>
      <p className="text-white/90 mb-4 md:mb-6 leading-relaxed text-sm md:text-base">{description}</p>
      <div className="flex gap-2 md:gap-4 items-center">
        <div className="flex items-center gap-1 md:gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-2 md:px-3 py-1 md:py-2">
          <Users size={14} />
          <span className="text-xs md:text-sm">{players}</span>
        </div>
        <div className="flex items-center gap-1">
          {[...Array(difficulty)].map((_, i) => (
            <Star key={i} size={12} fill="currentColor" />
          ))}
        </div>
      </div>
    </div>
    <div className="absolute bottom-2 md:bottom-4 right-2 md:right-4 bg-white/20 backdrop-blur-sm rounded-full p-2 md:p-3 group-hover:scale-110 transition-all duration-300">
      <Play size={16} fill="currentColor" />
    </div>
  </div>
);

// برا السالفة المحسنة
const BaraSalfaGame = ({ onBack }) => {
  const [gamePhase, setGamePhase] = useState('setup');
  const [players, setPlayers] = useState(['']);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [currentWord, setCurrentWord] = useState('');
  const [outsider, setOutsider] = useState('');
  const [playerCards, setPlayerCards] = useState({});
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showingCard, setShowingCard] = useState(false);
  const [votes, setVotes] = useState({});
  const [gameResult, setGameResult] = useState('');

  const categories = {
    'حيوانات': ['أسد', 'فيل', 'قرد', 'نمر', 'دب', 'ذئب', 'ثعلب', 'أرنب', 'قط', 'كلب', 'حصان', 'بقرة', 'خروف', 'ماعز', 'دجاج'],
    'طعام': ['كسكس', 'شوربة', 'خبز', 'لحم', 'سمك', 'أرز', 'مكرونة', 'سلطة', 'فواكه', 'خضار', 'حليب', 'جبن', 'زيتون', 'عسل', 'شاي'],
    'مهن': ['طبيب', 'معلم', 'مهندس', 'طباخ', 'سائق', 'بناء', 'خياط', 'حلاق', 'بائع', 'شرطي', 'إطفائي', 'محامي', 'صحفي', 'فنان', 'موسيقي'],
    'أماكن': ['مدرسة', 'مستشفى', 'مطعم', 'سوق', 'مسجد', 'بحر', 'جبل', 'حديقة', 'مكتبة', 'متحف', 'ملعب', 'مطار', 'محطة', 'فندق', 'بيت'],
    'أشياء': ['سيارة', 'طائرة', 'قطار', 'كتاب', 'قلم', 'هاتف', 'تلفاز', 'كمبيوتر', 'كرة', 'ساعة', 'مفتاح', 'نظارة', 'حقيبة', 'كرسي', 'طاولة'],
    'رياضة': ['كرة القدم', 'كرة السلة', 'تنس', 'سباحة', 'جري', 'ملاكمة', 'كاراتيه', 'جمباز', 'دراجة', 'تزلج', 'غوص', 'تسلق', 'يوغا', 'رقص', 'شطرنج']
  };

  const startGame = () => {
    if (players.filter(p => p.trim()).length >= 3 && selectedCategories.length > 0) {
      const activePlayers = players.filter(p => p.trim());
      const allWords = selectedCategories.flatMap(cat => categories[cat]);
      const randomWord = allWords[Math.floor(Math.random() * allWords.length)];
      const randomOutsider = activePlayers[Math.floor(Math.random() * activePlayers.length)];
      
      setCurrentWord(randomWord);
      setOutsider(randomOutsider);
      
      const cards = {};
      activePlayers.forEach(player => {
        cards[player] = player === randomOutsider ? 'دخيل' : randomWord;
      });
      
      setPlayerCards(cards);
      setCurrentCardIndex(0);
      setShowingCard(false);
      setGamePhase('cards');
    }
  };

  const showNextCard = () => {
    const playerNames = Object.keys(playerCards);
    if (currentCardIndex < playerNames.length) {
      setShowingCard(true);
      setTimeout(() => {
        setShowingCard(false);
        if (currentCardIndex === playerNames.length - 1) {
          setGamePhase('playing');
        } else {
          setCurrentCardIndex(prev => prev + 1);
        }
      }, 3000);
    }
  };

  const startVoting = () => {
    setGamePhase('voting');
    setVotes({});
  };

  const vote = (voter, suspect) => {
    setVotes(prev => ({
      ...prev,
      [voter]: suspect
    }));
  };

  const revealResults = () => {
    setGamePhase('reveal');
    
    const voteCount = {};
    Object.values(votes).forEach(suspect => {
      voteCount[suspect] = (voteCount[suspect] || 0) + 1;
    });
    
    const mostVoted = Object.keys(voteCount).reduce((a, b) => 
      voteCount[a] > voteCount[b] ? a : b
    );
    
    if (mostVoted === outsider) {
      setGameResult('فاز اللاعبون العاديون! تم اكتشاف الدخيل 🎉');
    } else {
      setGameResult('فاز الدخيل! لم يتم اكتشافه 🕵️');
    }
  };

  const resetGame = () => {
    setGamePhase('setup');
    setPlayers(['']);
    setSelectedCategories([]);
    setCurrentWord('');
    setOutsider('');
    setPlayerCards({});
    setCurrentCardIndex(0);
    setShowingCard(false);
    setVotes({});
    setGameResult('');
  };

  if (gamePhase === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-teal-900">
        <div className="container mx-auto px-4 md:px-6 py-4 md:py-8">
          <button
            onClick={onBack}
            className="mb-4 md:mb-8 bg-white/20 backdrop-blur-sm text-white px-4 md:px-6 py-2 md:py-3 rounded-xl hover:bg-white/30 transition-all duration-300 flex items-center gap-2 text-sm md:text-base"
          >
            <Home size={16} />
            العودة للرئيسية
          </button>
          
          <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg rounded-3xl p-4 md:p-8 border border-white/20">
            <div className="text-center mb-6 md:mb-8">
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 md:mb-4">🕵️ برا السالفة</h1>
              <p className="text-white/80 text-sm md:text-lg">اللعبة الجزائرية الأصيلة للذكاء والخداع</p>
            </div>
            
            <div className="space-y-4 md:space-y-6">
              <div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4">اختر الفئات:</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
                  {Object.keys(categories).map(category => (
                    <button
                      key={category}
                      onClick={() => {
                        if (selectedCategories.includes(category)) {
                          setSelectedCategories(prev => prev.filter(c => c !== category));
                        } else {
                          setSelectedCategories(prev => [...prev, category]);
                        }
                      }}
                      className={`p-2 md:p-3 rounded-xl font-bold transition-all duration-300 text-xs md:text-sm ${
                        selectedCategories.includes(category)
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4">أضف اللاعبين (3 على الأقل):</h3>
                {players.map((player, index) => (
                  <input
                    key={index}
                    type="text"
                    value={player}
                    onChange={(e) => {
                      const newPlayers = [...players];
                      newPlayers[index] = e.target.value;
                      setPlayers(newPlayers);
                    }}
                    placeholder={`اللاعب ${index + 1}`}
                    className="w-full p-3 md:p-4 mb-2 md:mb-3 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-white/60 border border-white/30 focus:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/20 text-sm md:text-base"
                  />
                ))}
                
                <div className="flex gap-2 md:gap-4">
                  <button
                    onClick={() => setPlayers([...players, ''])}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 md:py-4 rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 text-sm md:text-base"
                  >
                    إضافة لاعب
                  </button>
                  <button
                    onClick={startGame}
                    disabled={players.filter(p => p.trim()).length < 3 || selectedCategories.length === 0}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 md:py-4 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:from-orange-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 text-sm md:text-base"
                  >
                    ابدأ اللعبة 🚀
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gamePhase === 'cards') {
    const playerNames = Object.keys(playerCards);
    const currentPlayer = playerNames[currentCardIndex];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-teal-900 flex items-center justify-center">
        <div className="container mx-auto px-4 md:px-6 py-4 md:py-8">
          <div className="max-w-md mx-auto text-center">
            {!showingCard ? (
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 md:p-8 border border-white/20">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">دور {currentPlayer}</h2>
                <p className="text-white/80 mb-6 md:mb-8 text-sm md:text-base">اضغط لرؤية بطاقتك</p>
                <button
                  onClick={showNextCard}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 text-sm md:text-base"
                >
                  اكشف البطاقة 🎴
                </button>
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 md:p-8 border border-white/20">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">{currentPlayer}</h2>
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-6 md:p-8 mb-4 md:mb-6 animate-pulse">
                  <p className="text-2xl md:text-4xl font-bold text-gray-900">
                    {playerCards[currentPlayer]}
                  </p>
                </div>
                <p className="text-white/80 text-sm md:text-base">احفظ كلمتك جيداً... 3 ثوانٍ</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (gamePhase === 'playing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-teal-900">
        <div className="container mx-auto px-4 md:px-6 py-4 md:py-8">
          <button
            onClick={onBack}
            className="mb-4 md:mb-8 bg-white/20 backdrop-blur-sm text-white px-4 md:px-6 py-2 md:py-3 rounded-xl hover:bg-white/30 transition-all duration-300 flex items-center gap-2 text-sm md:text-base"
          >
            <Home size={16} />
            العودة للرئيسية
          </button>
          
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 md:mb-4">🎭 مرحلة النقاش</h2>
              <p className="text-white/80 text-sm md:text-lg mb-4 md:mb-6">ناقش مع الآخرين واكتشف من هو الدخيل!</p>
              <button
                onClick={startVoting}
                className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold hover:from-red-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 text-sm md:text-base"
              >
                بدء التصويت 🗳️
              </button>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 md:p-8 border border-white/20">
              <h3 className="text-lg md:text-2xl font-bold text-white mb-4 md:mb-6 text-center">💬 نصائح اللعب</h3>
              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-3 md:space-y-4">
                  <h4 className="text-base md:text-lg font-bold text-white">نصائح للاعبين العاديين:</h4>
                  <ul className="text-white/80 space-y-1 md:space-y-2 text-sm md:text-base">
                    <li>• اطرح أسئلة غامضة حول الكلمة</li>
                    <li>• لاحظ من يبدو مرتبكاً أو يتجنب الإجابة</li>
                    <li>• تعاون مع الآخرين لكشف الدخيل</li>
                  </ul>
                </div>
                <div className="space-y-3 md:space-y-4">
                  <h4 className="text-base md:text-lg font-bold text-white">نصائح للدخيل:</h4>
                  <ul className="text-white/80 space-y-1 md:space-y-2 text-sm md:text-base">
                    <li>• اطرح أسئلة عامة لتعرف الكلمة</li>
                    <li>• تظاهر بأنك تعرف الكلمة</li>
                    <li>• حاول توجيه الشك لآخرين</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gamePhase === 'voting') {
    const activePlayers = Object.keys(playerCards);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-teal-900">
        <div className="container mx-auto px-4 md:px-6 py-4 md:py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 md:mb-4">🗳️ مرحلة التصويت</h2>
              <p className="text-white/80 text-sm md:text-lg mb-4 md:mb-6">صوت لمن تعتقد أنه الدخيل!</p>
            </div>
            
            <div className="grid gap-4 md:gap-6 mb-6 md:mb-8">
              {activePlayers.map((voter) => (
                <div key={voter} className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 md:p-6 border border-white/20">
                  <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4 text-center">{voter}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
                    {activePlayers.filter(p => p !== voter).map((suspect) => (
                      <button
                        key={suspect}
                        onClick={() => vote(voter, suspect)}
                        className={`p-2 md:p-3 rounded-xl font-bold transition-all duration-300 text-xs md:text-sm ${
                          votes[voter] === suspect
                            ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white'
                            : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                      >
                        {suspect} {votes[voter] === suspect && '✓'}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <button
                onClick={revealResults}
                disabled={Object.keys(votes).length < activePlayers.length}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 text-sm md:text-base"
              >
                كشف النتائج 🎭
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gamePhase === 'reveal') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-teal-900">
        <div className="container mx-auto px-4 md:px-6 py-4 md:py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 md:p-8 border border-white/20 mb-6 md:mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 md:mb-6">🎉 انتهت اللعبة!</h2>
              
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-4 md:p-6 mb-4 md:mb-6">
                <p className="text-lg md:text-2xl font-bold text-gray-900 mb-1 md:mb-2">الكلمة كانت:</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900">{currentWord}</p>
              </div>
              
              <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl p-4 md:p-6 mb-4 md:mb-6">
                <p className="text-lg md:text-xl font-bold text-white mb-1 md:mb-2">الدخيل كان:</p>
                <p className="text-xl md:text-2xl font-bold text-white">{outsider}</p>
              </div>
              
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-4 md:p-6 mb-6 md:mb-8">
                <p className="text-lg md:text-2xl font-bold text-white">{gameResult}</p>
              </div>
              
              <div className="flex gap-2 md:gap-4">
                <button
                  onClick={resetGame}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 md:py-4 rounded-xl font-bold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 text-sm md:text-base"
                >
                  لعبة جديدة 🎮
                </button>
                <button
                  onClick={onBack}
                  className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 md:py-4 rounded-xl font-bold hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105 text-sm md:text-base"
                >
                  العودة للرئيسية 🏠
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

// لعبة الحروف المحسنة
const LetterGame = ({ onBack }) => {
  const [currentLetter, setCurrentLetter] = useState('');
  const [answers, setAnswers] = useState({ name: '', animal: '', object: '', place: '' });
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameActive, setGameActive] = useState(false);

  const arabicLetters = ['أ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'];

  useEffect(() => {
    let timer;
    if (gameActive && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      submitAnswers();
    }
    return () => clearTimeout(timer);
  }, [gameActive, timeLeft]);

  const startGame = () => {
    const randomLetter = arabicLetters[Math.floor(Math.random() * arabicLetters.length)];
    setCurrentLetter(randomLetter);
    setGameStarted(true);
    setGameActive(true);
    setTimeLeft(60);
    setAnswers({ name: '', animal: '', object: '', place: '' });
  };

  const submitAnswers = () => {
    setGameActive(false);
    let points = 0;
    Object.values(answers).forEach(answer => {
      if (answer.trim() && answer.trim().startsWith(currentLetter)) {
        points += 10;
      }
    });
    setScore(prev => prev + points);
    setTimeout(() => {
      alert(`حصلت على ${points} نقطة! الوقت انتهى.`);
      startGame();
    }, 100);
  };

  const updateAnswer = (category, value) => {
    setAnswers(prev => ({ ...prev, [category]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-teal-900 to-blue-900">
      <div className="container mx-auto px-4 md:px-6 py-4 md:py-8">
        <button
          onClick={onBack}
          className="mb-4 md:mb-8 bg-white/20 backdrop-blur-sm text-white px-4 md:px-6 py-2 md:py-3 rounded-xl hover:bg-white/30 transition-all duration-300 flex items-center gap-2 text-sm md:text-base"
        >
          <Home size={16} />
          العودة للرئيسية
        </button>
        
        <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg rounded-3xl p-4 md:p-8 border border-white/20">
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 md:mb-4">📝 حرف - اسم - حيوان - جماد - بلاد</h1>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Medal className="text-yellow-400" size={20} />
                <span className="text-lg md:text-xl font-bold text-white">النقاط: {score}</span>
              </div>
              {gameActive && (
                <div className="flex items-center gap-2">
                  <Clock className="text-red-400" size={20} />
                  <span className="text-lg md:text-xl font-bold text-white">{timeLeft}s</span>
                </div>
              )}
            </div>
          </div>
          
          {!gameStarted ? (
            <div className="text-center">
              <button
                onClick={startGame}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl text-lg md:text-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105"
              >
                ابدأ اللعبة 🎯
              </button>
            </div>
          ) : (
            <div className="space-y-4 md:space-y-6">
              <div className="text-center">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-4 md:p-6 mb-4 md:mb-6">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900">الحرف: {currentLetter}</h2>
                </div>
              </div>
              
              <div className="space-y-3 md:space-y-4">
                {[
                  { key: 'name', label: 'اسم إنسان', icon: '👤' },
                  { key: 'animal', label: 'حيوان', icon: '🐾' },
                  { key: 'object', label: 'جماد', icon: '📦' },
                  { key: 'place', label: 'بلد أو مكان', icon: '🏙️' }
                ].map(({ key, label, icon }) => (
                  <div key={key} className="space-y-2">
                    <label className="text-white font-bold flex items-center gap-2 text-sm md:text-base">
                      <span>{icon}</span>
                      {label}
                    </label>
                    <input
                      type="text"
                      value={answers[key]}
                      onChange={(e) => updateAnswer(key, e.target.value)}
                      disabled={!gameActive}
                      className="w-full p-3 md:p-4 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-white/60 border border-white/30 focus:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50 text-sm md:text-base"
                      placeholder={`${label} يبدأ بحرف ${currentLetter}`}
                    />
                  </div>
                ))}
              </div>
              
              <button
                onClick={submitAnswers}
                disabled={!gameActive}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 md:py-4 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 text-sm md:text-base"
              >
                إرسال الإجابات ✨
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// لعبة الألغاز
const RiddlesGame = ({ onBack }) => {
  const [currentRiddle, setCurrentRiddle] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [riddleIndex, setRiddleIndex] = useState(0);

  const riddles = [
    { question: 'ما هو الشيء الذي يمشي بلا أرجل ويبكي بلا عيون؟', answer: 'السحاب' },
    { question: 'ما هو الشيء الذي له رأس ولا يفكر؟', answer: 'الدبوس' },
    { question: 'ما هو الشيء الذي يأكل ولا يشبع؟', answer: 'النار' },
    { question: 'ما هو الشيء الذي يكتب ولا يقرأ؟', answer: 'القلم' },
    { question: 'ما هو الشيء الذي له عين واحدة ولا يرى؟', answer: 'الإبرة' },
    { question: 'ما هو الشيء الذي يجري ولا يمشي؟', answer: 'الماء' },
    { question: 'ما هو الشيء الذي يطير بلا جناح؟', answer: 'الوقت' },
    { question: 'ما هو الشيء الذي يقرص ولا يعض؟', answer: 'الجوع' },
    { question: 'ما هو الشيء الذي له أسنان ولا يأكل؟', answer: 'المشط' },
    { question: 'ما هو الشيء الذي يسمع بلا أذن ويتكلم بلا لسان؟', answer: 'الهاتف' }
  ];

  const startGame = () => {
    setCurrentRiddle(riddles[riddleIndex]);
    setUserAnswer('');
    setShowAnswer(false);
  };

  const checkAnswer = () => {
    if (userAnswer.trim().toLowerCase() === currentRiddle.answer.toLowerCase()) {
      setScore(prev => prev + 10);
      alert('إجابة صحيحة! +10 نقاط 🎉');
    } else {
      alert(`إجابة خاطئة. الإجابة الصحيحة: ${currentRiddle.answer}`);
    }
    nextRiddle();
  };

  const nextRiddle = () => {
    const nextIndex = (riddleIndex + 1) % riddles.length;
    setRiddleIndex(nextIndex);
    setCurrentRiddle(riddles[nextIndex]);
    setUserAnswer('');
    setShowAnswer(false);
  };

  const showCorrectAnswer = () => {
    setShowAnswer(true);
  };

  useEffect(() => {
    startGame();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="container mx-auto px-4 md:px-6 py-4 md:py-8">
        <button
          onClick={onBack}
          className="mb-4 md:mb-8 bg-white/20 backdrop-blur-sm text-white px-4 md:px-6 py-2 md:py-3 rounded-xl hover:bg-white/30 transition-all duration-300 flex items-center gap-2 text-sm md:text-base"
        >
          <Home size={16} />
          العودة للرئيسية
        </button>
        
        <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg rounded-3xl p-4 md:p-8 border border-white/20">
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 md:mb-4">🧩 ألغاز الحومة</h1>
            <div className="flex items-center justify-center gap-4">
              <Medal className="text-yellow-400" size={20} />
              <span className="text-lg md:text-xl font-bold text-white">النقاط: {score}</span>
            </div>
          </div>
          
          {currentRiddle && (
            <div className="space-y-4 md:space-y-6">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4">اللغز:</h2>
                <p className="text-white text-base md:text-lg leading-relaxed">{currentRiddle.question}</p>
              </div>
              
              {!showAnswer ? (
                <div className="space-y-3 md:space-y-4">
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="اكتب إجابتك هنا..."
                    className="w-full p-3 md:p-4 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-white/60 border border-white/30 focus:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/20 text-sm md:text-base"
                    onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                  />
                  
                  <div className="flex gap-2 md:gap-4">
                    <button
                      onClick={checkAnswer}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 md:py-4 rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 text-sm md:text-base"
                    >
                      تحقق من الإجابة ✓
                    </button>
                    <button
                      onClick={showCorrectAnswer}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 md:py-4 rounded-xl font-bold hover:from-orange-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 text-sm md:text-base"
                    >
                      أظهر الإجابة 💡
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 md:space-y-4">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-4 md:p-6">
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">الإجابة الصحيحة:</h3>
                    <p className="text-xl md:text-2xl font-bold text-gray-900">{currentRiddle.answer}</p>
                  </div>
                  
                  <button
                    onClick={nextRiddle}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 md:py-4 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 text-sm md:text-base"
                  >
                    اللغز التالي 🔄
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// لعبة الذاكرة
const MemoryGame = ({ onBack }) => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const emojis = ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎸', '🎺'];

  const initializeGame = () => {
    const gameCards = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji, flipped: false }));
    
    setCards(gameCards);
    setFlippedCards([]);
    setMatchedCards([]);
    setMoves(0);
    setGameStarted(true);
    setGameWon(false);
  };

  const flipCard = (cardId) => {
    if (flippedCards.length === 2 || flippedCards.includes(cardId) || matchedCards.includes(cardId)) {
      return;
    }

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      const [firstCard, secondCard] = newFlippedCards;
      const firstEmoji = cards.find(card => card.id === firstCard)?.emoji;
      const secondEmoji = cards.find(card => card.id === secondCard)?.emoji;

      if (firstEmoji === secondEmoji) {
        setMatchedCards(prev => [...prev, firstCard, secondCard]);
        setFlippedCards([]);
        
        if (matchedCards.length + 2 === cards.length) {
          setGameWon(true);
        }
      } else {
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 md:px-6 py-4 md:py-8">
        <button
          onClick={onBack}
          className="mb-4 md:mb-8 bg-white/20 backdrop-blur-sm text-white px-4 md:px-6 py-2 md:py-3 rounded-xl hover:bg-white/30 transition-all duration-300 flex items-center gap-2 text-sm md:text-base"
        >
          <Home size={16} />
          العودة للرئيسية
        </button>
        
        <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg rounded-3xl p-4 md:p-8 border border-white/20">
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 md:mb-4">🧠 ذاكرة الأبطال</h1>
            {gameStarted && (
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                  <Target className="text-blue-400" size={20} />
                  <span className="text-lg font-bold text-white">الحركات: {moves}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="text-yellow-400" size={20} />
                  <span className="text-lg font-bold text-white">المطابقات: {matchedCards.length / 2}/{emojis.length}</span>
                </div>
              </div>
            )}
          </div>
          
          {!gameStarted ? (
            <div className="text-center">
              <p className="text-white/80 mb-6 text-sm md:text-base">اقلب البطاقات وابحث عن الأزواج المتطابقة!</p>
              <button
                onClick={initializeGame}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl text-lg md:text-xl font-bold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
              >
                ابدأ اللعبة 🚀
              </button>
            </div>
          ) : gameWon ? (
            <div className="text-center space-y-4 md:space-y-6">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-4 md:p-6">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">🎉 مبروك!</h2>
                <p className="text-lg md:text-xl font-bold text-gray-900">أنهيت اللعبة في {moves} حركة!</p>
              </div>
              <button
                onClick={initializeGame}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 text-sm md:text-base"
              >
                لعبة جديدة 🔄
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2 md:gap-4">
              {cards.map((card) => (
                <div
                  key={card.id}
                  onClick={() => flipCard(card.id)}
                  className={`aspect-square rounded-xl cursor-pointer transition-all duration-300 flex items-center justify-center text-2xl md:text-4xl font-bold ${
                    flippedCards.includes(card.id) || matchedCards.includes(card.id)
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900'
                      : 'bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-500 hover:to-gray-600'
                  }`}
                >
                  {flippedCards.includes(card.id) || matchedCards.includes(card.id) ? card.emoji : '?'}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// لعبة الرياضيات السريعة
const MathGame = ({ onBack }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    let timer;
    if (gameActive && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      endGame();
    }
    return () => clearTimeout(timer);
  }, [gameActive, timeLeft]);

  const generateQuestion = () => {
    let num1, num2, operation, correctAnswer;
    
    if (level === 1) {
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
      operation = Math.random() > 0.5 ? '+' : '-';
    } else if (level === 2) {
      num1 = Math.floor(Math.random() * 20) + 1;
      num2 = Math.floor(Math.random() * 20) + 1;
      operation = ['+', '-', '×'][Math.floor(Math.random() * 3)];
    } else {
      num1 = Math.floor(Math.random() * 50) + 1;
      num2 = Math.floor(Math.random() * 50) + 1;
      operation = ['+', '-', '×', '÷'][Math.floor(Math.random() * 4)];
    }

    switch (operation) {
      case '+':
        correctAnswer = num1 + num2;
        break;
      case '-':
        correctAnswer = num1 - num2;
        break;
      case '×':
        correctAnswer = num1 * num2;
        break;
      case '÷':
        correctAnswer = Math.floor(num1 / num2);
        num1 = correctAnswer * num2; // Ensure clean division
        break;
    }

    setQuestion(`${num1} ${operation} ${num2} = ?`);
    setAnswer(correctAnswer.toString());
  };

  const startGame = () => {
    setGameActive(true);
    setTimeLeft(30);
    setScore(0);
    generateQuestion();
  };

  const checkAnswer = () => {
    if (userAnswer === answer) {
      setScore(prev => prev + (level * 10));
      if (score > 0 && score % 50 === 0) {
        setLevel(prev => Math.min(prev + 1, 3));
      }
    }
    setUserAnswer('');
    generateQuestion();
  };

  const endGame = () => {
    setGameActive(false);
    alert(`انتهت اللعبة! نقاطك النهائية: ${score}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
      <div className="container mx-auto px-4 md:px-6 py-4 md:py-8">
        <button
          onClick={onBack}
          className="mb-4 md:mb-8 bg-white/20 backdrop-blur-sm text-white px-4 md:px-6 py-2 md:py-3 rounded-xl hover:bg-white/30 transition-all duration-300 flex items-center gap-2 text-sm md:text-base"
        >
          <Home size={16} />
          العودة للرئيسية
        </button>
        
        <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg rounded-3xl p-4 md:p-8 border border-white/20">
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 md:mb-4">🔢 الرياضيات السريعة</h1>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Trophy className="text-yellow-400" size={20} />
                <span className="text-lg font-bold text-white">النقاط: {score}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="text-blue-400" size={20} />
                <span className="text-lg font-bold text-white">المستوى: {level}</span>
              </div>
              {gameActive && (
                <div className="flex items-center gap-2">
                  <Clock className="text-red-400" size={20} />
                  <span className="text-lg font-bold text-white">{timeLeft}s</span>
                </div>
              )}
            </div>
          </div>
          
          {!gameActive ? (
            <div className="text-center">
              <p className="text-white/80 mb-6 text-sm md:text-base">حل أكبر عدد من المسائل الرياضية في 30 ثانية!</p>
              <button
                onClick={startGame}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl text-lg md:text-xl font-bold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
              >
                ابدأ اللعبة ⚡
              </button>
            </div>
          ) : (
            <div className="space-y-4 md:space-y-6">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-4 md:p-6 text-center">
                <h2 className="text-2xl md:text-4xl font-bold text-gray-900">{question}</h2>
              </div>
              
              <div className="space-y-3 md:space-y-4">
                <input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="اكتب الإجابة..."
                  className="w-full p-3 md:p-4 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-white/60 border border-white/30 focus:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/20 text-center text-xl md:text-2xl font-bold"
                  onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                  autoFocus
                />
                
                <button
                  onClick={checkAnswer}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 md:py-4 rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 text-sm md:text-base"
                >
                  إرسال الإجابة ✓
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// لعبة تخمين الكلمة
const WordGuessGame = ({ onBack }) => {
  const [currentWord, setCurrentWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [gameLost, setGameLost] = useState(false);
  const [score, setScore] = useState(0);

  const words = [
    'جزائر', 'وهران', 'قسنطينة', 'عنابة', 'تلمسان', 'بجاية', 'سطيف', 'باتنة',
    'كسكس', 'شوربة', 'بوراك', 'مقروض', 'قلب اللوز', 'زلابية', 'شباكية',
    'صحراء', 'أطلس', 'متوسط', 'تاسيلي', 'هقار', 'شيليا', 'جرجرة'
  ];

  const maxWrongGuesses = 6;

  const startNewGame = () => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setCurrentWord(randomWord);
    setGuessedLetters([]);
    setWrongGuesses(0);
    setGameWon(false);
    setGameLost(false);
  };

  const guessLetter = (letter) => {
    if (guessedLetters.includes(letter) || gameWon || gameLost) return;

    const newGuessedLetters = [...guessedLetters, letter];
    setGuessedLetters(newGuessedLetters);

    if (!currentWord.includes(letter)) {
      const newWrongGuesses = wrongGuesses + 1;
      setWrongGuesses(newWrongGuesses);
      
      if (newWrongGuesses >= maxWrongGuesses) {
        setGameLost(true);
      }
    } else {
      // Check if word is complete
      const wordComplete = currentWord.split('').every(char => newGuessedLetters.includes(char));
      if (wordComplete) {
        setGameWon(true);
        setScore(prev => prev + (currentWord.length * 10));
      }
    }
  };

  const displayWord = () => {
    return currentWord.split('').map(letter => 
      guessedLetters.includes(letter) ? letter : '_'
    ).join(' ');
  };

  const arabicLetters = ['أ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'];

  useEffect(() => {
    startNewGame();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-green-900 to-emerald-900">
      <div className="container mx-auto px-4 md:px-6 py-4 md:py-8">
        <button
          onClick={onBack}
          className="mb-4 md:mb-8 bg-white/20 backdrop-blur-sm text-white px-4 md:px-6 py-2 md:py-3 rounded-xl hover:bg-white/30 transition-all duration-300 flex items-center gap-2 text-sm md:text-base"
        >
          <Home size={16} />
          العودة للرئيسية
        </button>
        
        <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg rounded-3xl p-4 md:p-8 border border-white/20">
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 md:mb-4">🔤 تخمين الكلمة</h1>
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <Trophy className="text-yellow-400" size={20} />
                <span className="text-lg font-bold text-white">النقاط: {score}</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="text-red-400" size={20} />
                <span className="text-lg font-bold text-white">المحاولات: {maxWrongGuesses - wrongGuesses}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4 md:space-y-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-4 md:p-6 text-center">
              <h2 className="text-2xl md:text-4xl font-bold text-white font-mono tracking-wider">
                {displayWord()}
              </h2>
            </div>
            
            {gameWon && (
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-4 md:p-6 text-center">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">🎉 مبروك!</h3>
                <p className="text-white">لقد خمنت الكلمة بنجاح!</p>
                <button
                  onClick={startNewGame}
                  className="mt-4 bg-white/20 backdrop-blur-sm text-white px-4 md:px-6 py-2 md:py-3 rounded-xl hover:bg-white/30 transition-all duration-300 text-sm md:text-base"
                >
                  كلمة جديدة 🔄
                </button>
              </div>
            )}
            
            {gameLost && (
              <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl p-4 md:p-6 text-center">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">😞 انتهت المحاولات</h3>
                <p className="text-white mb-2">الكلمة كانت: <strong>{currentWord}</strong></p>
                <button
                  onClick={startNewGame}
                  className="mt-4 bg-white/20 backdrop-blur-sm text-white px-4 md:px-6 py-2 md:py-3 rounded-xl hover:bg-white/30 transition-all duration-300 text-sm md:text-base"
                >
                  محاولة جديدة 🔄
                </button>
              </div>
            )}
            
            <div className="grid grid-cols-5 md:grid-cols-7 gap-2">
              {arabicLetters.map(letter => (
                <button
                  key={letter}
                  onClick={() => guessLetter(letter)}
                  disabled={guessedLetters.includes(letter) || gameWon || gameLost}
                  className={`p-2 md:p-3 rounded-xl font-bold transition-all duration-300 text-sm md:text-base ${
                    guessedLetters.includes(letter)
                      ? currentWord.includes(letter)
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                        : 'bg-gradient-to-r from-red-500 to-pink-600 text-white'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [currentGame, setCurrentGame] = useState(null);

  const games = [
    {
      id: 'bara-salfa',
      title: 'برا السالفة',
      description: 'اللعبة الجزائرية الأصيلة للذكاء والخداع. اكتشف من هو الدخيل قبل أن يكتشف الكلمة السرية!',
      icon: Brain,
      players: '3-8 لاعبين',
      difficulty: 4,
      featured: true,
      category: 'group'
    },
    {
      id: 'letters',
      title: 'حرف - حيوان - جماد',
      description: 'اللعبة الكلاسيكية بأسلوب عصري. اختبر سرعة بديهتك ومعلوماتك مع العد التنازلي!',
      icon: Lightbulb,
      players: '1+ لاعب',
      difficulty: 2,
      category: 'single'
    },
    {
      id: 'riddles',
      title: 'ألغاز الحومة',
      description: 'مجموعة من الألغاز الجزائرية الشعبية لتحدي عقلك وتنمية ذكائك.',
      icon: HelpCircle,
      players: '1+ لاعب',
      difficulty: 3,
      category: 'single'
    },
    {
      id: 'memory',
      title: 'ذاكرة الأبطال',
      description: 'اختبر قوة ذاكرتك مع هذه اللعبة المسلية والمفيدة. اقلب البطاقات وابحث عن الأزواج!',
      icon: Medal,
      players: '1+ لاعب',
      difficulty: 2,
      category: 'single'
    },
    {
      id: 'math',
      title: 'الرياضيات السريعة',
      description: 'تحدى نفسك في حل المسائل الرياضية بأسرع وقت ممكن!',
      icon: Zap,
      players: '1+ لاعب',
      difficulty: 3,
      category: 'single'
    },
    {
      id: 'word-guess',
      title: 'تخمين الكلمة',
      description: 'خمن الكلمة المخفية حرف بحرف قبل أن تنتهي المحاولات!',
      icon: Target,
      players: '1+ لاعب',
      difficulty: 2,
      category: 'single'
    }
  ];

  const renderGame = () => {
    switch (currentGame) {
      case 'bara-salfa':
        return <BaraSalfaGame onBack={() => setCurrentGame(null)} />;
      case 'letters':
        return <LetterGame onBack={() => setCurrentGame(null)} />;
      case 'riddles':
        return <RiddlesGame onBack={() => setCurrentGame(null)} />;
      case 'memory':
        return <MemoryGame onBack={() => setCurrentGame(null)} />;
      case 'math':
        return <MathGame onBack={() => setCurrentGame(null)} />;
      case 'word-guess':
        return <WordGuessGame onBack={() => setCurrentGame(null)} />;
      default:
        return null;
    }
  };

  if (currentGame) {
    return renderGame();
  }

  const singlePlayerGames = games.filter(game => game.category === 'single');
  const groupGames = games.filter(game => game.category === 'group');

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-4">
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-2 md:p-3 rounded-2xl">
                <Brain size={window.innerWidth < 768 ? 24 : 32} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg md:text-2xl font-bold text-white">خمم فيها</h1>
                <p className="text-white/70 text-xs md:text-sm">منصة الألعاب الذكية</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-2 text-white/80">
                <Users size={20} />
                <span>ألعاب جماعية</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <User size={20} />
                <span>ألعاب فردية</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-20 text-center">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight">
            أهلاً وسهلاً في
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent block md:inline"> خمم فيها</span>
          </h2>
          <p className="text-base md:text-xl text-white/80 mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed">
            منصة الألعاب الذكية الأولى للتسلية والذكاء. استمتع بألعاب متنوعة تحفز العقل مع أصدقائك وعائلتك
          </p>
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 md:px-6 py-2 md:py-3 text-white border border-white/30 text-xs md:text-base">
              🎭 برا السالفة المحسنة
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 md:px-6 py-2 md:py-3 text-white border border-white/30 text-xs md:text-base">
              🎮 6 ألعاب متنوعة
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 md:px-6 py-2 md:py-3 text-white border border-white/30 text-xs md:text-base">
              📱 متجاوب مع الهواتف
            </div>
          </div>
        </div>
      </section>

      {/* Group Games Section */}
      <section className="py-8 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-8 md:mb-16">
            <h3 className="text-2xl md:text-4xl font-bold text-white mb-2 md:mb-4">👥 الألعاب الجماعية</h3>
            <p className="text-white/80 text-sm md:text-lg max-w-2xl mx-auto">
              العب مع الأصدقاء والعائلة واستمتع بوقت رائع
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 max-w-6xl mx-auto">
            {groupGames.map((game) => (
              <GameCard
                key={game.id}
                {...game}
                onClick={() => setCurrentGame(game.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Single Player Games Section */}
      <section className="py-8 md:py-16 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-8 md:mb-16">
            <h3 className="text-2xl md:text-4xl font-bold text-white mb-2 md:mb-4">👤 الألعاب الفردية</h3>
            <p className="text-white/80 text-sm md:text-lg max-w-2xl mx-auto">
              تحدى نفسك وطور مهاراتك الذهنية
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 max-w-6xl mx-auto">
            {singlePlayerGames.map((game) => (
              <GameCard
                key={game.id}
                {...game}
                onClick={() => setCurrentGame(game.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-8 md:mb-16">
            <h3 className="text-2xl md:text-4xl font-bold text-white mb-2 md:mb-4">لماذا خمم فيها؟</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 md:p-4 rounded-2xl mx-auto w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-all duration-300">
                <Brain size={window.innerWidth < 768 ? 24 : 32} className="text-white" />
              </div>
              <h4 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3">تنمية الذكاء</h4>
              <p className="text-white/80 text-sm md:text-base">ألعاب مصممة لتحفيز التفكير الإبداعي والمنطقي</p>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 md:p-4 rounded-2xl mx-auto w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-all duration-300">
                <Users size={window.innerWidth < 768 ? 24 : 32} className="text-white" />
              </div>
              <h4 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3">تفاعل اجتماعي</h4>
              <p className="text-white/80 text-sm md:text-base">استمتع مع الأصدقاء والعائلة في جو من المرح</p>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 p-3 md:p-4 rounded-2xl mx-auto w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-all duration-300">
                <Star size={window.innerWidth < 768 ? 24 : 32} className="text-white" />
              </div>
              <h4 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3">تجربة متميزة</h4>
              <p className="text-white/80 text-sm md:text-base">ألعاب متنوعة بتصميم حديث ومتجاوب</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-sm py-8 md:py-12 border-t border-white/20">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="flex items-center justify-center gap-2 md:gap-4 mb-4 md:mb-6">
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-2 rounded-xl">
              <Brain size={20} className="text-white" />
            </div>
            <h4 className="text-lg md:text-xl font-bold text-white">خمم فيها</h4>
          </div>
          <p className="text-white/70 mb-2 md:mb-4 text-sm md:text-base">منصة الألعاب الذكية الأولى</p>
          <p className="text-white/50 text-xs md:text-sm">© 2025 خمم فيها - جميع الحقوق محفوظة</p>
        </div>
      </footer>
    </div>
  );
}

export default App;