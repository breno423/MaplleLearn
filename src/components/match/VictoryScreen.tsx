import React from 'react';
import { LogOut, Sparkles } from 'lucide-react';
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
      
      {/* Container principal que segura o card e a órbita */}
      <div className="victory-card-wrapper animate-fade-in">
        
        {/* Sistema de Órbita do Maplle */}
        <div className="orbit-system">
          <div className="orbit-rotation-fix">
            <div className="orbit-bounce">
              <Maplle />
            </div>
          </div>
        </div>

        {/* Card de Vitória */}
        <div className="victory-card">
          <div className="eyebrow victory-eyebrow stagger-1">
            <Sparkles size={16} /> 
            FIM DE JOGO
          </div>

          <h1 className={`victory-title stagger-2 ${isWinner ? 'text-win' : isTie ? 'text-tie' : 'text-loss'}`}>
            {isWinner ? 'Você Venceu! 🏆' : isTie ? 'Empate! 🤝' : 'Você Perdeu! 💔'}
          </h1>
          
          <p className="victory-subtitle stagger-3">
            {isWinner 
              ? 'O Maplle está muito orgulhoso do seu desempenho!' 
              : isTie 
                ? 'Uma batalha épica e acirrada até o último segundo!' 
                : 'Não desanime, continue praticando para a próxima!'}
          </p>

          <div className="victory-scoreboard stagger-4">
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

          <button className="submit-button victory-action-btn stagger-5" onClick={onLeave}>
            <LogOut size={18} />
            Sair da partida
          </button>
        </div>
      </div>
    </div>
  );
}