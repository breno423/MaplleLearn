import React from 'react';
import { Trophy, Frown, Equal, ArrowRight, LogOut, Sparkles } from 'lucide-react';
import { Maplle } from '../../App'; // Ajuste o caminho se necessário
import './VictoryScreen.css';

interface VictoryScreenProps {
  myScore: number;
  opponentScore: number;
  opponentName: string;
  onLeave: () => void;
}

export default function VictoryScreen({ myScore, opponentScore, opponentName, onLeave }: VictoryScreenProps) {
  const isWinner = myScore > opponentScore;
  const isTie = myScore === opponentScore;

  return (
    <div className="victory-overlay">
      <div className="victory-card animate-pop-in">
        <div className="victory-mascot-container animate-bounce">
          <Maplle />
        </div>

        <div className="eyebrow victory-eyebrow">
          <Sparkles size={16} /> 
          FIM DE JOGO
        </div>

        <h1 className={`victory-title ${isWinner ? 'text-win' : isTie ? 'text-tie' : 'text-loss'}`}>
          {isWinner ? 'Você Venceu! 🏆' : isTie ? 'Empate! 🤝' : 'Você Perdeu! 💔'}
        </h1>
        
        <p className="victory-subtitle">
          {isWinner 
            ? 'O Maplle está muito orgulhoso do seu desempenho!' 
            : isTie 
              ? 'Uma batalha acirrada até o último segundo!' 
              : 'Não desanime, continue praticando para a próxima!'}
        </p>

        <div className="victory-scoreboard">
          <div className={`score-box ${isWinner || isTie ? 'score-winner' : ''}`}>
            <span className="score-label">SEUS PONTOS</span>
            <span className="score-value">{myScore}</span>
          </div>
          
          <div className="score-divider">VS</div>
          
          <div className={`score-box ${!isWinner || isTie ? 'score-winner' : ''}`}>
            <span className="score-label">{opponentName.toUpperCase()}</span>
            <span className="score-value">{opponentScore}</span>
          </div>
        </div>

        <button className="submit-button victory-action-btn" onClick={onLeave}>
          <LogOut size={18} />
          Sair da partida
        </button>
      </div>
    </div>
  );
}