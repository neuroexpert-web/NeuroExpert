'use client';

import { useEffect } from 'react';

export default function WindowManager() {
  useEffect(() => {
    initializeWindows();
  }, []);

  const initializeWindows = () => {
    const windows = document.querySelectorAll('.floating-window');
    windows.forEach(window => {
      const header = window.querySelector('.window-header');
      if (header) {
        makeDraggable(window, header);
      }

      // Window controls
      const closeBtn = window.querySelector('.window-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          window.classList.remove('active');
        });
      }
    });

    // Open AI Assistant button
    const aiBtn = document.querySelector('[data-view="ai-assistant"]');
    if (aiBtn) {
      aiBtn.addEventListener('click', () => {
        const aiWindow = document.getElementById('ai-assistant-window');
        if (aiWindow) {
          aiWindow.classList.add('active');
          aiWindow.style.top = '100px';
          aiWindow.style.left = '400px';
        }
      });
    }
  };

  const makeDraggable = (element, handle) => {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    
    handle.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      element.style.top = (element.offsetTop - pos2) + "px";
      element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  };

  return null;
}