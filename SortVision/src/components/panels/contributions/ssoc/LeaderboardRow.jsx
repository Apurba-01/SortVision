import React from 'react';
import { Crown, ExternalLink, Link2, User } from 'lucide-react';

const getTopThreeStyles = (index) => {
  switch(index) {
    case 0:
      return 'bg-gradient-to-r from-yellow-500/10 via-transparent to-transparent';
    case 1:
      return 'bg-gradient-to-r from-slate-400/10 via-transparent to-transparent';
    case 2:
      return 'bg-gradient-to-r from-amber-700/10 via-transparent to-transparent';
    default:
      return '';
  }
};

const getRankStyles = (index) => {
  switch(index) {
    case 0:
      return 'text-yellow-400 animate-text-shimmer bg-gradient-to-r from-yellow-600 via-yellow-300 to-yellow-600 bg-clip-text text-transparent bg-[length:200%_100%]';
    case 1:
      return 'text-slate-300 animate-text-shimmer bg-gradient-to-r from-slate-500 via-slate-200 to-slate-500 bg-clip-text text-transparent bg-[length:200%_100%]';
    case 2:
      return 'text-amber-600 animate-text-shimmer bg-gradient-to-r from-amber-700 via-amber-500 to-amber-700 bg-clip-text text-transparent bg-[length:200%_100%]';
    default:
      return 'text-indigo-300 hover:text-indigo-200 transition-colors duration-200';
  }
};

const LeaderboardRow = ({ participant, index }) => {
  const handleIssueClick = (difficulty) => {
    const label = difficulty === 'Advanced' ? 'Advance' : difficulty;
    window.open(
      `https://github.com/alienx5499/SortVision/issues?q=is%3Aissue+is%3Aclosed+assignee%3A${participant.githubId}+label%3A${label}+label%3A%22SSOC+S4%22`,
      '_blank'
    );
  };

  return (
    <tr 
      className={`border-t border-white/5 transition-all duration-300 hover:bg-indigo-900/10
        ${index < 3 ? getTopThreeStyles(index) : ''}`}
    >
      <td className="px-6 py-4 w-24">
        <div className="flex items-center gap-2 font-semibold">
          {index === 0 && (
            <Crown className="w-4 h-4 text-yellow-500 animate-pulse" />
          )}
          <span className={`${getRankStyles(index)} ${index >= 3 ? 'rank-4-plus' : ''}`}>
            #{index + 1}
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <a 
            href={`https://github.com/${participant.githubId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="relative group hover:scale-105 transition-transform duration-200"
          >
            {participant.avatarUrl ? (
              <img
                src={participant.avatarUrl}
                alt={participant.contributorName}
                className="w-10 h-10 rounded-full ring-2 ring-white/10 group-hover:ring-white/30 transition-all duration-200"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center ring-2 ring-white/10 group-hover:ring-white/30">
                <User className="w-6 h-6 text-gray-400" />
              </div>
            )}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-200"></div>
          </a>
          <div className="flex flex-col">
            <a 
              href={`https://github.com/${participant.githubId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <div className={`font-semibold flex items-center gap-2 ${getRankStyles(index)} ${index >= 3 ? 'rank-4-plus' : ''} group-hover:scale-105 transition-transform duration-200`}>
                {participant.contributorName}
                <ExternalLink className="w-3 h-3 transition-all duration-200 group-hover:scale-110 group-hover:rotate-12" />
              </div>
              <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-200 tracking-wide">
                @{participant.githubId}
              </div>
            </a>
          </div>
        </div>
      </td>
      <td className="px-2 py-4 text-center">
        <div 
          onClick={() => handleIssueClick('Beginner')}
          className="group/btn inline-block w-full py-2 px-4 rounded-md hover:bg-green-500/10 active:bg-green-500/20 cursor-pointer transition-all duration-200"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleIssueClick('Beginner')}
        >
          <span className="beginner-issues flex items-center justify-center gap-2 group-hover/btn:scale-105">
            {participant.beginnerIssues}
            <Link2 className="w-3 h-3 opacity-50 group-hover/btn:opacity-100 transition-all duration-200" />
          </span>
        </div>
      </td>
      <td className="px-2 py-4 text-center">
        <div 
          onClick={() => handleIssueClick('Intermediate')}
          className="group/btn inline-block w-full py-2 px-4 rounded-md hover:bg-yellow-500/10 active:bg-yellow-500/20 cursor-pointer transition-all duration-200"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleIssueClick('Intermediate')}
        >
          <span className="intermediate-issues flex items-center justify-center gap-2 group-hover/btn:scale-105">
            {participant.intermediateIssues}
            <Link2 className="w-3 h-3 opacity-50 group-hover/btn:opacity-100 transition-all duration-200" />
          </span>
        </div>
      </td>
      <td className="px-2 py-4 text-center">
        <div 
          onClick={() => handleIssueClick('Advanced')}
          className="group/btn inline-block w-full py-2 px-4 rounded-md hover:bg-red-500/10 active:bg-red-500/20 cursor-pointer transition-all duration-200"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleIssueClick('Advanced')}
        >
          <span className="advanced-issues flex items-center justify-center gap-2 group-hover/btn:scale-105">
            {participant.advancedIssues}
            <Link2 className="w-3 h-3 opacity-50 group-hover/btn:opacity-100 transition-all duration-200" />
          </span>
        </div>
      </td>
      <td className={`px-6 py-4 text-right font-semibold tracking-wider ${getRankStyles(index)} ${index >= 3 ? 'rank-4-plus' : ''}`}>
        {participant.totalPoints}
      </td>
    </tr>
  );
};

export default LeaderboardRow; 