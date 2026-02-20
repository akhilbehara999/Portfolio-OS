import React from 'react';

const AppPlaceholder: React.FC<{ windowId?: string }> = ({ windowId }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <h1 className="text-2xl font-bold">App Placeholder</h1>
      <p>This app is under construction.</p>
      {windowId && <p className="text-sm opacity-50">Window ID: {windowId}</p>}
    </div>
  );
};

export default AppPlaceholder;
