'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { ROIResults } from '../../types';

interface ROIResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: ROIResults;
  formData: {
    businessSize: string;
    industry: string;
    budget: number;
  };
}

export default function ROIResultModal({ isOpen, onClose, results, formData }: ROIResultModalProps) {
  const formatCurrency = (num: number): string => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0
    }).format(num);
  };

  const getBusinessSizeText = (size: string) => {
    switch(size) {
      case 'small': return 'Малый бизнес (до 50 сотрудников)';
      case 'medium': return 'Средний бизнес (50-250 сотрудников)';
      case 'large': return 'Крупный бизнес (250+ сотрудников)';
      default: return size;
    }
  };

  const getIndustryText = (industry: string) => {
    switch(industry) {
      case 'retail': return 'Розничная торговля';
      case 'services': return 'Услуги';
      case 'production': return 'Производство';
      case 'it': return 'IT и технологии';
      case 'other': return 'Другое';
      default: return industry;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(10px)',
              zIndex: 1000,
              cursor: 'pointer'
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2
                       bg-gradient-to-b from-gray-900/95 to-gray-800/95 backdrop-blur-xl
                       rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12
                       border border-purple-500/30 shadow-2xl
                       max-w-full md:max-w-3xl w-full
                       max-h-[calc(100vh-2rem)] md:max-h-[90vh] overflow-y-auto
                       z-[1001]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="text-center mb-6 md:mb-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="text-5xl md:text-7xl mb-3 md:mb-5"
              >
                🎉
              </motion.div>
              <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4 
                           bg-gradient-to-r from-purple-400 to-purple-600 
                           bg-clip-text text-transparent">
                Ваш потенциал роста
              </h2>
              <p className="text-gray-400 text-sm md:text-lg">
                Персональный расчет эффективности цифровизации
              </p>
            </div>

            {/* Input Summary */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-purple-500/10 p-4 md:p-6 rounded-xl md:rounded-2xl mb-6 md:mb-8 
                       border border-purple-500/20"
            >
              <h3 className="text-purple-400 mb-3 md:mb-4 text-lg md:text-xl font-semibold">
                📊 Ваши параметры:
              </h3>
              <div className="grid gap-2 md:gap-3">
                <div className="text-indigo-200 text-sm md:text-base">
                  <span className="text-gray-400">Размер компании:</span> {getBusinessSizeText(formData.businessSize)}
                </div>
                <div className="text-indigo-200 text-sm md:text-base">
                  <span className="text-gray-400">Отрасль:</span> {getIndustryText(formData.industry)}
                </div>
                <div className="text-indigo-200 text-sm md:text-base">
                  <span className="text-gray-400">Инвестиции в цифровизацию:</span> {formatCurrency(formData.budget)}
                </div>
              </div>
            </motion.div>

            {/* Main Results */}
            <div className="grid gap-4 md:gap-6 mb-6 md:mb-8">
              {/* ROI */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 
                         p-6 md:p-8 rounded-xl md:rounded-2xl border border-purple-500/30 
                         text-center"
              >
                <h3 className="text-gray-400 mb-2 text-base md:text-lg">
                  Возврат инвестиций (ROI)
                </h3>
                <div className="text-4xl sm:text-5xl md:text-6xl font-bold mb-2 
                              bg-gradient-to-r from-purple-400 to-purple-600 
                              bg-clip-text text-transparent">
                  {results.roi}%
                </div>
                <p className="text-indigo-200 text-sm md:text-base">
                  за 3 года работы с нами
                </p>
              </motion.div>

              {/* Detailed Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-green-500/10 p-4 md:p-6 rounded-xl md:rounded-2xl 
                           border border-green-500/30"
                >
                  <div className="text-green-400 text-2xl md:text-3xl mb-2">💰</div>
                  <h4 className="text-indigo-200 mb-2 text-sm md:text-base">Годовая экономия</h4>
                  <div className="text-xl md:text-2xl font-semibold text-green-400">
                    {formatCurrency(results.savings)}
                  </div>
                  <p className="text-gray-400 text-xs md:text-sm mt-1">
                    на оптимизации процессов
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-blue-500/10 p-4 md:p-6 rounded-xl md:rounded-2xl 
                           border border-blue-500/30"
                >
                  <div className="text-blue-400 text-2xl md:text-3xl mb-2">📈</div>
                  <h4 className="text-indigo-200 mb-2 text-sm md:text-base">Рост доходов</h4>
                  <div className="text-xl md:text-2xl font-semibold text-blue-400">
                    {formatCurrency(results.growth)}
                  </div>
                  <p className="text-gray-400 text-xs md:text-sm mt-1">
                    дополнительной прибыли
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bg-orange-500/10 p-4 md:p-6 rounded-xl md:rounded-2xl 
                           border border-orange-500/30"
                >
                  <div className="text-orange-400 text-2xl md:text-3xl mb-2">⏱️</div>
                  <h4 className="text-indigo-200 mb-2 text-sm md:text-base">Окупаемость</h4>
                  <div className="text-xl md:text-2xl font-semibold text-orange-400">
                    {results.payback} мес.
                  </div>
                  <p className="text-gray-400 text-xs md:text-sm mt-1">
                    полный возврат инвестиций
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-purple-600/10 p-4 md:p-8 rounded-xl md:rounded-2xl mb-6 md:mb-8
                       border border-purple-600/20"
            >
              <h3 className="text-purple-400 mb-4 md:mb-5 text-lg md:text-2xl font-semibold">
                🚀 Что вы получите с NeuroExpert:
              </h3>
              <div className="grid gap-3 md:gap-4">
                <div className="flex items-center gap-2 md:gap-3">
                  <span className="text-xl md:text-2xl">✅</span>
                  <span className="text-indigo-200 text-sm md:text-base">Автоматизация до 80% рутинных операций</span>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                  <span className="text-xl md:text-2xl">✅</span>
                  <span className="text-indigo-200 text-sm md:text-base">Увеличение конверсии на 40-60%</span>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                  <span className="text-xl md:text-2xl">✅</span>
                  <span className="text-indigo-200 text-sm md:text-base">Снижение затрат на маркетинг до 35%</span>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                  <span className="text-xl md:text-2xl">✅</span>
                  <span className="text-indigo-200 text-sm md:text-base">Рост лояльности клиентов на 50%</span>
                </div>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="text-center"
            >
              <p className="text-indigo-200 mb-4 md:mb-6 text-base md:text-lg">
                Готовы увеличить прибыль на {results.roi}%?
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    import('@/app/utils/aiChat').then(({ openAIChat }) => {
                      openAIChat(`Здравствуйте! Я рассчитал ROI и получил впечатляющие ${results.roi}% за 3 года. Хочу узнать подробнее о вашем предложении для ${getIndustryText(formData.industry)}.`);
                    });
                    onClose();
                  }}
                  className="px-6 md:px-10 py-3 md:py-4 
                           bg-gradient-to-r from-purple-500 to-purple-700
                           border-none rounded-full text-white 
                           text-sm md:text-lg font-semibold cursor-pointer
                           shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40
                           transition-all duration-300 w-full sm:w-auto"
                >
                  💬 Обсудить с AI директором
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                    onClose();
                  }}
                  className="px-6 md:px-10 py-3 md:py-4 
                           bg-transparent border-2 border-purple-500/50
                           rounded-full text-purple-400 
                           text-sm md:text-lg font-semibold cursor-pointer
                           hover:border-purple-400 hover:text-purple-300
                           transition-all duration-300 w-full sm:w-auto"
                >
                  📞 Получить консультацию
                </motion.button>
              </div>
            </motion.div>

            {/* Close button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-3 right-3 md:top-6 md:right-6
                       bg-white/10 border-none rounded-full
                       w-8 h-8 md:w-10 md:h-10 
                       flex items-center justify-center
                       cursor-pointer text-gray-400 hover:text-white
                       text-base md:text-xl
                       transition-colors duration-300"
            >
              ✕
            </motion.button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}