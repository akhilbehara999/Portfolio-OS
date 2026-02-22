import React, { useState, useEffect, useRef, type KeyboardEvent } from 'react';
import { virtualFs } from '@core/file-system/virtual-fs';
import { useAppStore } from '@store/app.store';
import { useThemeStore } from '@store/theme.store';
import { PORTFOLIO_DATA } from '@config/portfolio-data';
import { THEME_PRESETS } from '@config/theme-presets';
import { WALLPAPERS } from '@config/wallpapers';
import { APP_REGISTRY } from '@config/app-registry';
import { useOSStore } from '@store/os.store';

interface TerminalOutput {
  id: string;
  type: 'command' | 'response' | 'error' | 'ascii';
  content: React.ReactNode;
  path?: string;
}

const STARTUP_BANNER = `
  _____           _    __      _ _            ____  _____
 |  __ \\         | |  / _|    | (_)          / __ \\/ ____|
 | |__) |___  ___| |_| |_ ___ | |_  ________| |  | | (___
 |  ___// _ \\/ _ \\ __|  _/ _ \\| | |/ _ \\____| |  | |\\___ \\
 | |   | (_) |  __/ |_| || (_) | | | (_) |    | |__| |____) |
 |_|    \\___/ \\___|\\__|_| \\___/|_|_|\\___/      \\____/|_____/

 Welcome to PortfolioOS Terminal v1.0.0
 Type 'help' to see available commands.
`;

const TerminalApp: React.FC = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [output, setOutput] = useState<TerminalOutput[]>([
    { id: 'banner', type: 'ascii', content: STARTUP_BANNER }
  ]);
  const [currentPath, setCurrentPath] = useState('/home/user');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { launchApp } = useAppStore();
  const { setTheme, setWallpaper } = useThemeStore();
  const { uptime, deviceMode } = useOSStore();

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [output]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const addToOutput = (type: TerminalOutput['type'], content: React.ReactNode, path?: string) => {
    setOutput(prev => [...prev.slice(-499), { // Keep last 500 lines
      id: Math.random().toString(36).substring(7),
      type,
      content,
      path
    }]);
  };

  const handleCommand = (cmdString: string) => {
    const trimmedCmd = cmdString.trim();
    if (!trimmedCmd) {
      addToOutput('command', trimmedCmd, currentPath);
      return;
    }

    addToOutput('command', trimmedCmd, currentPath);
    setHistory(prev => [trimmedCmd, ...prev]);
    setHistoryIndex(-1);

    const [cmd, ...args] = trimmedCmd.split(/\s+/);

    switch (cmd.toLowerCase()) {
      case 'help':
        addToOutput('response', (
          <div className="grid grid-cols-[120px_1fr] gap-2">
            <span className="text-yellow-400">about</span><span>Display info about me</span>
            <span className="text-yellow-400">skills</span><span>List technical skills</span>
            <span className="text-yellow-400">projects</span><span>List projects</span>
            <span className="text-yellow-400">project [n]</span><span>Show project details</span>
            <span className="text-yellow-400">education</span><span>Show education info</span>
            <span className="text-yellow-400">experience</span><span>Show work experience</span>
            <span className="text-yellow-400">contact</span><span>Show contact details</span>
            <span className="text-yellow-400">resume</span><span>Open resume app</span>
            <span className="text-yellow-400">social</span><span>List social links</span>
            <span className="text-yellow-400">ls</span><span>List directory contents</span>
            <span className="text-yellow-400">cd [dir]</span><span>Change directory</span>
            <span className="text-yellow-400">cat [file]</span><span>Read file</span>
            <span className="text-yellow-400">pwd</span><span>Print working directory</span>
            <span className="text-yellow-400">whoami</span><span>Print current user</span>
            <span className="text-yellow-400">date</span><span>Print current date</span>
            <span className="text-yellow-400">echo [txt]</span><span>Print text</span>
            <span className="text-yellow-400">clear</span><span>Clear terminal</span>
            <span className="text-yellow-400">neofetch</span><span>System info</span>
            <span className="text-yellow-400">theme</span><span>Change theme</span>
            <span className="text-yellow-400">open [app]</span><span>Launch application</span>
            <span className="text-yellow-400">exit</span><span>Close terminal</span>
          </div>
        ));
        break;

      case 'about':
        addToOutput('response', (
          <div>
            <div className="text-cyan-400 font-bold mb-2">Hello! I'm {PORTFOLIO_DATA.personal.name}</div>
            <div className="mb-2">{PORTFOLIO_DATA.personal.bio}</div>
            <div className="text-gray-400">{PORTFOLIO_DATA.personal.tagline}</div>
          </div>
        ));
        break;

      case 'skills':
        addToOutput('response', (
          <div className="grid grid-cols-2 gap-4 max-w-2xl">
            {PORTFOLIO_DATA.skills.map((skill, i) => (
              <div key={i} className="flex justify-between">
                <span className="text-green-400">{skill.name}</span>
                <span className="text-gray-500">{'[' + '#'.repeat(Math.floor(skill.proficiency/10)) + '-'.repeat(10 - Math.floor(skill.proficiency/10)) + ']'}</span>
              </div>
            ))}
          </div>
        ));
        break;

      case 'projects':
        addToOutput('response', (
          <div>
            <div className="mb-2 text-purple-400 font-bold">Available Projects:</div>
            {PORTFOLIO_DATA.projects.map((p, i) => (
              <div key={i} className="mb-1">
                <span className="text-yellow-400">[{i + 1}]</span> <span className="font-bold">{p.title}</span> - {p.description}
              </div>
            ))}
            <div className="mt-2 text-gray-500">Type 'project [number]' for more details.</div>
          </div>
        ));
        break;

      case 'project':
        const idx = parseInt(args[0]) - 1;
        if (!isNaN(idx) && PORTFOLIO_DATA.projects[idx]) {
          const p = PORTFOLIO_DATA.projects[idx];
          addToOutput('response', (
            <div className="border-l-2 border-purple-500 pl-4 my-2">
              <div className="text-xl font-bold text-purple-400">{p.title}</div>
              <div className="text-sm text-gray-400 mb-2">{p.category} | {p.techStack.join(', ')}</div>
              <div className="mb-4">{p.longDescription}</div>
              {p.githubLink && <div>GitHub: <a href={p.githubLink} target="_blank" rel="noreferrer" className="text-blue-400 underline">{p.githubLink}</a></div>}
              {p.liveLink && <div>Live: <a href={p.liveLink} target="_blank" rel="noreferrer" className="text-blue-400 underline">{p.liveLink}</a></div>}
            </div>
          ));
        } else {
          addToOutput('error', 'Project not found. Type "projects" to see list.');
        }
        break;

      case 'education':
        addToOutput('response', (
          <div>
             {PORTFOLIO_DATA.education.map((edu, i) => (
               <div key={i} className="mb-4">
                 <div className="text-cyan-400 font-bold">{edu.university}</div>
                 <div className="text-white">{edu.degree}</div>
                 <div className="text-gray-400 text-sm">{edu.timeline} | CGPA: {edu.cgpa}</div>
                 <div className="text-gray-300 mt-1">{edu.description}</div>
               </div>
             ))}
          </div>
        ));
        break;

      case 'experience':
        addToOutput('response', (
          <div>
            {PORTFOLIO_DATA.experience.map((exp, i) => (
              <div key={i} className="mb-4 border-l-2 border-green-500 pl-4">
                <div className="text-green-400 font-bold">{exp.role} @ {exp.company}</div>
                <div className="text-gray-400 text-sm mb-2">{exp.duration}</div>
                <ul className="list-disc list-inside text-gray-300">
                  {exp.description.map((desc, j) => (
                    <li key={j}>{desc}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ));
        break;

      case 'certifications':
        addToOutput('response', (
          <div>
            {PORTFOLIO_DATA.certifications.map((cert, i) => (
               <div key={i} className="mb-2">
                 <span className="text-yellow-400">★</span> <span className="font-bold">{cert.title}</span>
                 <div className="pl-5 text-gray-400 text-sm">{cert.issuer} ({cert.date})</div>
               </div>
            ))}
          </div>
        ));
        break;

      case 'contact':
        addToOutput('response', (
          <div>
             <div>Email: <a href={`mailto:${PORTFOLIO_DATA.contact.email}`} className="text-blue-400">{PORTFOLIO_DATA.contact.email}</a></div>
             {PORTFOLIO_DATA.contact.phone && <div>Phone: {PORTFOLIO_DATA.contact.phone}</div>}
             <div>Location: {PORTFOLIO_DATA.contact.location}</div>
          </div>
        ));
        break;

      case 'social':
        addToOutput('response', (
          <div>
            {PORTFOLIO_DATA.contact.socials.map((s, i) => (
              <div key={i}>
                <span className="w-24 inline-block text-blue-400">{s.platform}:</span>
                <a href={s.url} target="_blank" rel="noreferrer" className="underline">{s.url}</a>
              </div>
            ))}
          </div>
        ));
        break;

      case 'resume':
        addToOutput('response', 'Opening Resume Viewer...');
        launchApp('resume');
        break;

      case 'ls':
        const node = virtualFs.getNodeByPath(currentPath);
        if (node && node.type === 'folder' && node.children) {
          const children = node.children.map(id => virtualFs.getNode(id)).filter(Boolean);
          addToOutput('response', (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {children.map((child: any) => (
                 <span key={child.id} className={child.type === 'folder' ? 'text-blue-400 font-bold' : 'text-white'}>
                   {child.name}{child.type === 'folder' ? '/' : ''}
                 </span>
              ))}
            </div>
          ));
        } else {
           addToOutput('error', `Error listing directory: ${currentPath}`);
        }
        break;

      case 'cd':
        const pathArg = args[0] || '~';
        let targetPath = pathArg;

        if (pathArg === '~') targetPath = '/home/user';
        else if (pathArg === '..') {
           const parts = currentPath.split('/');
           parts.pop();
           targetPath = parts.join('/') || '/';
        } else if (pathArg.startsWith('/')) {
           targetPath = pathArg;
        } else {
           // relative path
           targetPath = `${currentPath === '/' ? '' : currentPath}/${pathArg}`;
        }

        const targetNode = virtualFs.getNodeByPath(targetPath);
        if (targetNode && targetNode.type === 'folder') {
          setCurrentPath(targetNode.path);
        } else {
          addToOutput('error', `cd: ${pathArg}: No such directory`);
        }
        break;

      case 'cat':
        if (!args[0]) {
          addToOutput('error', 'cat: missing file operand');
          break;
        }
        const filePath = args[0].startsWith('/')
          ? args[0]
          : `${currentPath === '/' ? '' : currentPath}/${args[0]}`;

        const fileNode = virtualFs.getNodeByPath(filePath);
        if (fileNode && fileNode.type === 'file') {
          // For virtual fs, we might not have real content in 'content' property if it's dynamic
          // But based on initialization, some have content.
          // We can also map to portfolio data if it matches certain names
          if (fileNode.name === 'Resume.pdf') {
             addToOutput('response', '[Binary file: Resume.pdf] - Use "resume" command to view.');
          } else {
             addToOutput('response', (fileNode.content as string) || '[Empty file]');
          }
        } else {
          addToOutput('error', `cat: ${args[0]}: No such file`);
        }
        break;

      case 'pwd':
        addToOutput('response', currentPath);
        break;

      case 'whoami':
        addToOutput('response', 'visitor');
        break;

      case 'date':
        addToOutput('response', new Date().toString());
        break;

      case 'echo':
        addToOutput('response', args.join(' '));
        break;

      case 'clear':
      case 'cls':
        setOutput([]);
        break;

      case 'neofetch':
        addToOutput('response', (
          <div className="flex gap-4 text-sm font-mono">
             <pre className="text-blue-500 hidden sm:block">
{`       _
      (_)
  _ __ _  ___
 | '__| |/ _ \\
 | |  | | (_) |
 |_|  |_|\\___/ `}
             </pre>
             <div className="flex flex-col justify-center">
               <div><span className="text-blue-400">visitor</span>@<span className="text-blue-400">portfolio-os</span></div>
               <div>-----------------------</div>
               <div><span className="text-yellow-400">OS</span>: PortfolioOS v1.0.0</div>
               <div><span className="text-yellow-400">Host</span>: {navigator.userAgent.includes('Chrome') ? 'Chrome' : 'Browser'}</div>
               <div><span className="text-yellow-400">Kernel</span>: React 19.0.0</div>
               <div><span className="text-yellow-400">Uptime</span>: {Math.floor(uptime / 60)} mins</div>
               <div><span className="text-yellow-400">Packages</span>: {APP_REGISTRY.length} (dpkg)</div>
               <div><span className="text-yellow-400">Shell</span>: TerminalJS</div>
               <div><span className="text-yellow-400">Theme</span>: {useThemeStore.getState().currentTheme.name}</div>
               <div><span className="text-yellow-400">Device</span>: {deviceMode}</div>
               <div className="mt-2 flex gap-1">
                 <span className="w-3 h-3 bg-black"></span>
                 <span className="w-3 h-3 bg-red-500"></span>
                 <span className="w-3 h-3 bg-green-500"></span>
                 <span className="w-3 h-3 bg-yellow-500"></span>
                 <span className="w-3 h-3 bg-blue-500"></span>
                 <span className="w-3 h-3 bg-purple-500"></span>
                 <span className="w-3 h-3 bg-cyan-500"></span>
                 <span className="w-3 h-3 bg-white"></span>
               </div>
             </div>
          </div>
        ));
        break;

      case 'theme':
        if (args[0]) {
          const theme = THEME_PRESETS.find(t => t.id === args[0] || t.name.toLowerCase() === args[0].toLowerCase());
          if (theme) {
            setTheme(theme.id);
            addToOutput('response', `Theme switched to ${theme.name}`);
          } else {
             addToOutput('error', `Theme '${args[0]}' not found. Available: ${THEME_PRESETS.map(t => t.id).join(', ')}`);
          }
        } else {
           addToOutput('response', `Current theme: ${useThemeStore.getState().currentTheme.name}\nAvailable: ${THEME_PRESETS.map(t => t.id).join(', ')}`);
        }
        break;

      case 'wallpaper':
        if (args[0]) {
           const wp = WALLPAPERS.find(w => w.id === args[0]);
           if (wp) {
             setWallpaper(wp.id);
             addToOutput('response', `Wallpaper set to ${wp.name}`);
           } else {
             addToOutput('error', `Wallpaper '${args[0]}' not found.`);
           }
        } else {
           addToOutput('response', `Available wallpapers: ${WALLPAPERS.map(w => w.id).join(', ')}`);
        }
        break;

      case 'history':
        addToOutput('response', (
          <div>
            {history.slice().reverse().map((cmd, i) => (
              <div key={i}>{i + 1}  {cmd}</div>
            ))}
          </div>
        ));
        break;

      case 'open':
        if (args[0]) {
          const app = APP_REGISTRY.find(a => a.id === args[0] || a.name.toLowerCase() === args[0].toLowerCase());
          if (app) {
             launchApp(app.id);
             addToOutput('response', `Launching ${app.name}...`);
          } else {
             addToOutput('error', `App '${args[0]}' not found.`);
          }
        } else {
           addToOutput('response', `Available apps: ${APP_REGISTRY.map(a => a.id).join(', ')}`);
        }
        break;

      case 'exit':
        // We can't easily close the window from here without windowId,
        // but typically 'exit' closes terminal.
        // In real OS, we would use window store.
        // Assuming we can pass windowId prop if this component receives it.
        // But for now, we'll just say bye.
        addToOutput('response', 'Goodbye! (Close the window manually)');
        break;

      default:
        addToOutput('error', `Command not found: ${cmd}. Type 'help' for available commands.`);
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const nextIndex = Math.min(historyIndex + 1, history.length - 1);
        setHistoryIndex(nextIndex);
        setInput(history[nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setInput(history[nextIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const cmds = ['help', 'about', 'skills', 'projects', 'education', 'experience', 'certifications', 'contact', 'resume', 'social', 'ls', 'cd', 'cat', 'pwd', 'whoami', 'date', 'echo', 'clear', 'neofetch', 'theme', 'wallpaper', 'history', 'open', 'exit'];
      const matches = cmds.filter(c => c.startsWith(input));
      if (matches.length === 1) {
        setInput(matches[0] + ' ');
      }
    }
  };

  return (
    <div
      className="h-full w-full bg-[#0c0c0c] text-green-500 font-mono text-sm p-4 overflow-hidden flex flex-col"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="absolute top-0 left-0 right-0 h-6 bg-[#1a1a1a] flex items-center justify-center text-gray-400 text-xs border-b border-[#333]">
        user@portfolio-os: ~
      </div>
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto mt-6 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
      >
        {output.map((line) => (
          <div key={line.id} className="mb-1 break-words">
            {line.type === 'command' && (
              <div className="flex">
                <span className="text-blue-400 mr-2 min-w-fit">visitor@portfolio-os:{line.path}$</span>
                <span className="text-white">{line.content}</span>
              </div>
            )}
            {line.type === 'response' && <div className="text-gray-300 ml-0">{line.content}</div>}
            {line.type === 'error' && <div className="text-red-400">{line.content}</div>}
            {line.type === 'ascii' && <pre className="text-green-500 font-bold leading-none">{line.content}</pre>}
          </div>
        ))}

        <div className="flex items-center mt-2">
           <span className="text-blue-400 mr-2 min-w-fit">visitor@portfolio-os:{currentPath}$</span>
           <input
             ref={inputRef}
             type="text"
             value={input}
             onChange={(e) => setInput(e.target.value)}
             onKeyDown={onKeyDown}
             className="flex-1 bg-transparent border-none outline-none text-white caret-white"
             autoComplete="off"
             autoFocus
           />
        </div>
      </div>
    </div>
  );
};

export default TerminalApp;
