-- ============================================
-- База данных для интеграции x402 в NeuroExpert
-- ============================================
-- Дата создания: 30 сентября 2025
-- Версия: 1.0

-- ============================================
-- Таблица пользователей
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  wallet_address VARCHAR(42),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_wallet ON users(wallet_address);

-- ============================================
-- Таблица балансов пользователей
-- ============================================
CREATE TABLE IF NOT EXISTS user_balances (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  balance DECIMAL(12,2) DEFAULT 0.00,
  currency VARCHAR(10) DEFAULT 'USD',
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, currency)
);

CREATE INDEX idx_balances_user ON user_balances(user_id);

-- ============================================
-- Таблица криптовалютных транзакций
-- ============================================
CREATE TABLE IF NOT EXISTS crypto_transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Информация о транзакции
  tx_hash VARCHAR(66) NOT NULL UNIQUE,
  chain VARCHAR(20) NOT NULL,
  token VARCHAR(10) NOT NULL,
  
  -- Суммы
  amount DECIMAL(12,2) NOT NULL,
  amount_in_token DECIMAL(30,0) NOT NULL,
  
  -- Статус
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  -- pending, confirmed, failed, cancelled
  
  -- Метод платежа
  payment_method VARCHAR(20) NOT NULL,
  -- x402, direct
  
  -- Блокчейн данные
  block_number INTEGER,
  confirmations INTEGER DEFAULT 0,
  gas_used DECIMAL(20,0),
  gas_price DECIMAL(20,0),
  
  -- Адреса
  from_address VARCHAR(42) NOT NULL,
  to_address VARCHAR(42) NOT NULL,
  
  -- Временные метки
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  confirmed_at TIMESTAMP,
  failed_at TIMESTAMP,
  
  -- Дополнительная информация
  error_message TEXT,
  metadata JSONB,
  
  -- Facilitator данные (для x402)
  facilitator_payload TEXT,
  facilitator_signature TEXT
);

-- Индексы для быстрого поиска
CREATE INDEX idx_crypto_tx_hash ON crypto_transactions(tx_hash);
CREATE INDEX idx_crypto_user_id ON crypto_transactions(user_id);
CREATE INDEX idx_crypto_status ON crypto_transactions(status);
CREATE INDEX idx_crypto_created ON crypto_transactions(created_at DESC);
CREATE INDEX idx_crypto_user_status ON crypto_transactions(user_id, status);
CREATE INDEX idx_crypto_chain_token ON crypto_transactions(chain, token);

-- ============================================
-- Таблица истории балансов
-- ============================================
CREATE TABLE IF NOT EXISTS balance_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  transaction_id INTEGER REFERENCES crypto_transactions(id),
  
  -- Изменения
  operation VARCHAR(20) NOT NULL,
  -- deposit, withdrawal, usage, refund
  amount DECIMAL(12,2) NOT NULL,
  
  -- Балансы
  balance_before DECIMAL(12,2) NOT NULL,
  balance_after DECIMAL(12,2) NOT NULL,
  
  -- Описание
  description TEXT,
  
  -- Временная метка
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_balance_history_user ON balance_history(user_id);
CREATE INDEX idx_balance_history_tx ON balance_history(transaction_id);
CREATE INDEX idx_balance_history_created ON balance_history(created_at DESC);

-- ============================================
-- Таблица использования агентов
-- ============================================
CREATE TABLE IF NOT EXISTS agent_usage (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  agent_id VARCHAR(50) NOT NULL,
  
  -- Метрики использования
  tasks_completed INTEGER DEFAULT 0,
  data_processed DECIMAL(10,2) DEFAULT 0,
  active_time_minutes DECIMAL(10,2) DEFAULT 0,
  api_calls INTEGER DEFAULT 0,
  
  -- Стоимость
  cost DECIMAL(10,2) DEFAULT 0,
  
  -- Период
  period_start TIMESTAMP NOT NULL,
  period_end TIMESTAMP NOT NULL,
  
  -- Создание
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_agent_usage_user ON agent_usage(user_id);
CREATE INDEX idx_agent_usage_agent ON agent_usage(agent_id);
CREATE INDEX idx_agent_usage_period ON agent_usage(period_start, period_end);

-- ============================================
-- Таблица незавершенных платежей
-- ============================================
CREATE TABLE IF NOT EXISTS pending_payments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Детали платежа
  amount DECIMAL(12,2) NOT NULL,
  chain VARCHAR(20) NOT NULL,
  token VARCHAR(10) NOT NULL,
  
  -- Payload
  payment_payload TEXT NOT NULL,
  signed_payload TEXT,
  
  -- Сроки
  deadline TIMESTAMP NOT NULL,
  initiated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  
  -- Статус
  status VARCHAR(20) DEFAULT 'initiated',
  -- initiated, signed, verifying, completed, expired, failed
  
  -- Результат
  tx_hash VARCHAR(66),
  error_message TEXT
);

CREATE INDEX idx_pending_user ON pending_payments(user_id);
CREATE INDEX idx_pending_status ON pending_payments(status);
CREATE INDEX idx_pending_deadline ON pending_payments(deadline);

-- ============================================
-- Таблица настроек пользователя
-- ============================================
CREATE TABLE IF NOT EXISTS user_settings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  
  -- Настройки платежей
  preferred_chain VARCHAR(20) DEFAULT 'base',
  preferred_token VARCHAR(10) DEFAULT 'usdc',
  auto_payment_enabled BOOLEAN DEFAULT FALSE,
  auto_payment_threshold DECIMAL(10,2) DEFAULT 10.00,
  auto_payment_amount DECIMAL(10,2) DEFAULT 100.00,
  
  -- Уведомления
  email_notifications BOOLEAN DEFAULT TRUE,
  payment_notifications BOOLEAN DEFAULT TRUE,
  balance_alerts BOOLEAN DEFAULT TRUE,
  
  -- Другие настройки
  settings JSONB,
  
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Таблица лимитов транзакций
-- ============================================
CREATE TABLE IF NOT EXISTS transaction_limits (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Лимиты
  daily_limit DECIMAL(12,2) DEFAULT 1000.00,
  monthly_limit DECIMAL(12,2) DEFAULT 10000.00,
  single_tx_limit DECIMAL(12,2) DEFAULT 1000.00,
  
  -- Использование (обновляется триггерами)
  daily_spent DECIMAL(12,2) DEFAULT 0.00,
  monthly_spent DECIMAL(12,2) DEFAULT 0.00,
  
  -- Период
  period_start DATE DEFAULT CURRENT_DATE,
  
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(user_id)
);

-- ============================================
-- Таблица логов API
-- ============================================
CREATE TABLE IF NOT EXISTS api_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  
  -- HTTP запрос
  method VARCHAR(10) NOT NULL,
  endpoint VARCHAR(255) NOT NULL,
  status_code INTEGER NOT NULL,
  
  -- Время выполнения
  execution_time_ms INTEGER,
  
  -- IP и User Agent
  ip_address VARCHAR(45),
  user_agent TEXT,
  
  -- Временная метка
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_api_logs_user ON api_logs(user_id);
CREATE INDEX idx_api_logs_endpoint ON api_logs(endpoint);
CREATE INDEX idx_api_logs_created ON api_logs(created_at DESC);

-- ============================================
-- Функции и триггеры
-- ============================================

-- Функция для обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Триггеры для updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at
    BEFORE UPDATE ON user_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Функция для автоматического обновления баланса при подтверждении транзакции
CREATE OR REPLACE FUNCTION update_balance_on_transaction_confirm()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'confirmed' AND OLD.status != 'confirmed' THEN
        -- Обновляем баланс пользователя
        UPDATE user_balances 
        SET balance = balance + NEW.amount,
            last_updated = CURRENT_TIMESTAMP
        WHERE user_id = NEW.user_id AND currency = 'USD';
        
        -- Создаем запись в истории балансов
        INSERT INTO balance_history (
            user_id, 
            transaction_id, 
            operation, 
            amount, 
            balance_before, 
            balance_after,
            description
        )
        SELECT 
            NEW.user_id,
            NEW.id,
            'deposit',
            NEW.amount,
            COALESCE(balance, 0) - NEW.amount,
            COALESCE(balance, 0),
            'Пополнение баланса через ' || NEW.payment_method
        FROM user_balances 
        WHERE user_id = NEW.user_id AND currency = 'USD';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггер для обновления баланса
CREATE TRIGGER trigger_update_balance_on_confirm
    AFTER UPDATE ON crypto_transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_balance_on_transaction_confirm();

-- ============================================
-- Представления (Views)
-- ============================================

-- Представление для статистики пользователей
CREATE OR REPLACE VIEW user_stats AS
SELECT 
    u.id,
    u.email,
    u.wallet_address,
    COALESCE(ub.balance, 0) as balance,
    COUNT(DISTINCT ct.id) as total_transactions,
    SUM(CASE WHEN ct.status = 'confirmed' THEN ct.amount ELSE 0 END) as total_deposited,
    MAX(ct.created_at) as last_transaction_date
FROM users u
LEFT JOIN user_balances ub ON u.id = ub.user_id AND ub.currency = 'USD'
LEFT JOIN crypto_transactions ct ON u.id = ct.user_id
GROUP BY u.id, u.email, u.wallet_address, ub.balance;

-- Представление для последних транзакций
CREATE OR REPLACE VIEW recent_transactions AS
SELECT 
    ct.id,
    ct.user_id,
    u.email,
    ct.tx_hash,
    ct.chain,
    ct.token,
    ct.amount,
    ct.status,
    ct.payment_method,
    ct.created_at,
    ct.confirmed_at,
    ct.confirmations
FROM crypto_transactions ct
JOIN users u ON ct.user_id = u.id
ORDER BY ct.created_at DESC
LIMIT 100;

-- ============================================
-- Начальные данные (опционально)
-- ============================================

-- Создаем тестового пользователя (только для разработки!)
-- INSERT INTO users (email, wallet_address) 
-- VALUES ('test@example.com', '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb');

-- Создаем начальный баланс
-- INSERT INTO user_balances (user_id, balance, currency)
-- VALUES (1, 0.00, 'USD');

-- ============================================
-- Комментарии к таблицам
-- ============================================

COMMENT ON TABLE users IS 'Пользователи платформы NeuroExpert';
COMMENT ON TABLE user_balances IS 'Балансы пользователей в различных валютах';
COMMENT ON TABLE crypto_transactions IS 'История всех криптовалютных транзакций';
COMMENT ON TABLE balance_history IS 'История изменений балансов пользователей';
COMMENT ON TABLE agent_usage IS 'Данные об использовании AI агентов';
COMMENT ON TABLE pending_payments IS 'Незавершенные платежные транзакции';
COMMENT ON TABLE user_settings IS 'Настройки пользователей';
COMMENT ON TABLE transaction_limits IS 'Лимиты транзакций для пользователей';
COMMENT ON TABLE api_logs IS 'Логи API запросов';

-- ============================================
-- Завершение
-- ============================================

-- Выводим информацию о созданных таблицах
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;
