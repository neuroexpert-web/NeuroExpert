'use client';

import { useState, useEffect } from 'react';
import { 
  connectWallet, 
  disconnectWallet,
  switchNetwork,
  getCurrentChainId,
  formatAddress,
  onAccountsChanged,
  onChainChanged,
  isWeb3Available,
  getSavedWalletConnection,
  saveWalletConnection,
  clearSavedWalletConnection
} from '../../utils/blockchain';
import { X402_CONFIG, getChainConfig } from '../../lib/x402Config';

/**
 * Компонент для подключения Web3 кошелька
 */
export default function WalletConnector({ onWalletConnected, onWalletDisconnected }) {
  const [walletAddress, setWalletAddress] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [showChainSelector, setShowChainSelector] = useState(false);

  // Проверка сохраненного подключения при монтировании
  useEffect(() => {
    const checkSavedConnection = async () => {
      const saved = getSavedWalletConnection();
      if (saved && isWeb3Available()) {
        try {
          // Попытка автоматического подключения
          const wallet = await connectWallet();
          setWalletAddress(wallet.address);
          setChainId(wallet.chainId);
          
          if (onWalletConnected) {
            onWalletConnected(wallet);
          }
        } catch (error) {
          console.log('Автоматическое подключение не удалось:', error);
          clearSavedWalletConnection();
        }
      }
    };

    checkSavedConnection();
  }, [onWalletConnected]);

  // Слушатели изменений кошелька
  useEffect(() => {
    if (!walletAddress) return;

    // Обработка изменения аккаунта
    const unsubscribeAccounts = onAccountsChanged((newAddress) => {
      if (newAddress) {
        setWalletAddress(newAddress);
        saveWalletConnection(newAddress, chainId);
        if (onWalletConnected) {
          onWalletConnected({ address: newAddress, chainId });
        }
      } else {
        handleDisconnect();
      }
    });

    // Обработка изменения сети
    const unsubscribeChain = onChainChanged((newChainId) => {
      setChainId(newChainId);
      if (walletAddress) {
        saveWalletConnection(walletAddress, newChainId);
        if (onWalletConnected) {
          onWalletConnected({ address: walletAddress, chainId: newChainId });
        }
      }
    });

    return () => {
      unsubscribeAccounts();
      unsubscribeChain();
    };
  }, [walletAddress, chainId, onWalletConnected]);

  // Подключение кошелька
  const handleConnect = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      if (!isWeb3Available()) {
        throw new Error('Web3 кошелек не обнаружен. Установите MetaMask или Coinbase Wallet.');
      }

      const wallet = await connectWallet();
      setWalletAddress(wallet.address);
      setChainId(wallet.chainId);
      
      // Сохранение состояния
      saveWalletConnection(wallet.address, wallet.chainId);

      if (onWalletConnected) {
        onWalletConnected(wallet);
      }
    } catch (error) {
      console.error('Ошибка подключения:', error);
      setError(error.message);
    } finally {
      setIsConnecting(false);
    }
  };

  // Отключение кошелька
  const handleDisconnect = async () => {
    try {
      await disconnectWallet();
      setWalletAddress(null);
      setChainId(null);
      clearSavedWalletConnection();

      if (onWalletDisconnected) {
        onWalletDisconnected();
      }
    } catch (error) {
      console.error('Ошибка отключения:', error);
    }
  };

  // Переключение сети
  const handleSwitchNetwork = async (chainName) => {
    setError(null);
    try {
      const success = await switchNetwork(chainName);
      if (success) {
        const newChainId = await getCurrentChainId();
        setChainId(newChainId);
        setShowChainSelector(false);
        
        if (walletAddress) {
          saveWalletConnection(walletAddress, newChainId);
        }
      } else {
        setError('Не удалось переключить сеть');
      }
    } catch (error) {
      console.error('Ошибка переключения сети:', error);
      setError(error.message);
    }
  };

  // Получение названия текущей сети
  const getChainName = () => {
    if (!chainId) return 'Неизвестная сеть';
    
    const chainEntry = Object.entries(X402_CONFIG.supportedChains).find(
      ([_, config]) => config.chainId === chainId
    );
    
    return chainEntry ? chainEntry[1].name : `Chain ${chainId}`;
  };

  // Проверка, находимся ли в поддерживаемой сети
  const isUnsupportedNetwork = () => {
    if (!chainId) return false;
    
    return !Object.values(X402_CONFIG.supportedChains).some(
      config => config.chainId === chainId
    );
  };

  if (!walletAddress) {
    // Кнопка подключения кошелька
    return (
      <div className="wallet-connector">
        <button 
          className="connect-wallet-button"
          onClick={handleConnect}
          disabled={isConnecting}
        >
          {isConnecting ? 'Подключение...' : '🔗 Подключить кошелек'}
        </button>
        
        {error && (
          <div className="wallet-error">
            <span>❌</span>
            <p>{error}</p>
          </div>
        )}

        {!isWeb3Available() && (
          <div className="wallet-install-hint">
            <p>Для использования платежей установите:</p>
            <div className="wallet-options">
              <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer">
                MetaMask
              </a>
              <span>или</span>
              <a href="https://www.coinbase.com/wallet" target="_blank" rel="noopener noreferrer">
                Coinbase Wallet
              </a>
            </div>
          </div>
        )}

        <style jsx>{`
          .wallet-connector {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          .connect-wallet-button {
            padding: 0.75rem 1.5rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
          }

          .connect-wallet-button:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
          }

          .connect-wallet-button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          .wallet-error {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem;
            background: #fee;
            border: 1px solid #fcc;
            border-radius: 6px;
            color: #c33;
          }

          .wallet-install-hint {
            padding: 1rem;
            background: #f0f4ff;
            border-radius: 8px;
            text-align: center;
          }

          .wallet-options {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 0.5rem;
            margin-top: 0.5rem;
          }

          .wallet-options a {
            color: #667eea;
            font-weight: 600;
            text-decoration: none;
          }

          .wallet-options a:hover {
            text-decoration: underline;
          }
        `}</style>
      </div>
    );
  }

  // Информация о подключенном кошельке
  return (
    <div className="wallet-connected">
      <div className="wallet-info">
        <div className="wallet-address">
          <span className="wallet-icon">👛</span>
          <span className="address">{formatAddress(walletAddress)}</span>
        </div>
        
        <div className="wallet-network">
          <button 
            className={`network-button ${isUnsupportedNetwork() ? 'unsupported' : ''}`}
            onClick={() => setShowChainSelector(!showChainSelector)}
          >
            <span className="network-icon">🌐</span>
            <span>{getChainName()}</span>
            <span className="dropdown-icon">▼</span>
          </button>
        </div>

        <button 
          className="disconnect-button"
          onClick={handleDisconnect}
          title="Отключить кошелек"
        >
          ❌
        </button>
      </div>

      {isUnsupportedNetwork() && (
        <div className="network-warning">
          ⚠️ Неподдерживаемая сеть. Переключитесь на Base или Ethereum.
        </div>
      )}

      {showChainSelector && (
        <div className="chain-selector">
          <h4>Выберите сеть:</h4>
          {Object.entries(X402_CONFIG.supportedChains).map(([key, config]) => (
            <button
              key={key}
              className={`chain-option ${chainId === config.chainId ? 'active' : ''}`}
              onClick={() => handleSwitchNetwork(key)}
            >
              <span className="chain-name">{config.name}</span>
              {chainId === config.chainId && <span className="check">✓</span>}
            </button>
          ))}
        </div>
      )}

      {error && (
        <div className="wallet-error">
          <span>❌</span>
          <p>{error}</p>
        </div>
      )}

      <style jsx>{`
        .wallet-connected {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .wallet-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
          border: 1px solid #667eea30;
          border-radius: 8px;
        }

        .wallet-address {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex: 1;
        }

        .wallet-icon {
          font-size: 1.2rem;
        }

        .address {
          font-family: monospace;
          font-weight: 600;
          color: #667eea;
        }

        .wallet-network {
          position: relative;
        }

        .network-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          background: white;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .network-button:hover {
          border-color: #667eea;
        }

        .network-button.unsupported {
          border-color: #f44;
          color: #f44;
        }

        .network-icon {
          font-size: 1rem;
        }

        .dropdown-icon {
          font-size: 0.7rem;
          opacity: 0.6;
        }

        .disconnect-button {
          padding: 0.5rem;
          background: transparent;
          border: none;
          font-size: 1rem;
          cursor: pointer;
          opacity: 0.6;
          transition: opacity 0.2s;
        }

        .disconnect-button:hover {
          opacity: 1;
        }

        .network-warning {
          padding: 0.75rem;
          background: #fff3cd;
          border: 1px solid #ffc107;
          border-radius: 6px;
          color: #856404;
          font-size: 0.875rem;
        }

        .chain-selector {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 0.5rem;
          padding: 0.75rem;
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          z-index: 100;
          min-width: 200px;
        }

        .chain-selector h4 {
          margin: 0 0 0.75rem 0;
          font-size: 0.875rem;
          font-weight: 600;
          color: #666;
        }

        .chain-option {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          padding: 0.75rem;
          background: transparent;
          border: 1px solid transparent;
          border-radius: 6px;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s;
        }

        .chain-option:hover {
          background: #f5f5f5;
        }

        .chain-option.active {
          background: #667eea15;
          border-color: #667eea;
        }

        .chain-name {
          font-weight: 500;
        }

        .check {
          color: #667eea;
          font-weight: bold;
        }

        .wallet-error {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem;
          background: #fee;
          border: 1px solid #fcc;
          border-radius: 6px;
          color: #c33;
          font-size: 0.875rem;
        }
      `}</style>
    </div>
  );
}
