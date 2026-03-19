import React from 'react';

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="text-center py-4 sm:py-6">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary tracking-tight">
        {title}
      </h1>
      <p className="text-xs sm:text-sm text-text-muted mt-1">
        Ultimate Tic-Tac-Toe
      </p>
    </header>
  );
};
