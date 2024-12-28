import { fetch_data } from '../utils/fetch_data.js';

export class Vim {
    static originalLinesContent = null;
    static preElement = null;
    static totalLines = 38;

    static show_modal(file_name) {
        const data = fetch_data(file_name);

        const modal_div = document.getElementById('vimModal');
        modal_div.classList.add('show');

        const div = document.createElement('div');
        div.classList.add('modal-content');

        const closeBtn = document.createElement('span');
        closeBtn.classList.add('modal-close');
        closeBtn.innerText = '✖';
        closeBtn.addEventListener('click', () => {
            window.removeEventListener('resize', Vim.debounced_resize);

            modal_div.innerHTML = '';
            modal_div.classList.remove('show');
        });
        div.appendChild(closeBtn);

        const pre = document.createElement('pre');
        Vim.preElement = pre;

        data.then((fileContent) => {
            Vim.originalLinesContent = fileContent.split('\n');
            Vim.render_wrapped_lines();
            window.addEventListener('resize', Vim.debounced_resize);
        }).catch(() => {
            modal_div.classList.remove('show');
            modal_div.innerHTML = '';
            window.removeEventListener('resize', Vim.debounced_resize);
        });

        div.appendChild(pre);
        modal_div.appendChild(div);
    }

    static debounced_resize = Vim.debounce(() => {
        Vim.render_wrapped_lines();
    }, 50);

    static render_wrapped_lines() {
        if (!Vim.preElement || !Vim.originalLinesContent) return;

        const containerWidth = Vim.preElement.clientWidth;
        const charWidth = 12;
        const maxCharsPerLine = Math.floor(containerWidth / charWidth);
        const safeMax = Math.max(15, maxCharsPerLine);

        const wrappedLines = [];

        for (const originalLine of Vim.originalLinesContent) {
            if (originalLine.length === 0) {
                wrappedLines.push('');
            } else {
                let offset = 0;
                while (offset < originalLine.length) {
                    wrappedLines.push(
                        originalLine.slice(offset, offset + safeMax),
                    );
                    offset += safeMax;
                }
            }
        }

        const totalLines = Vim.totalLines;
        let fullContent = '';

        for (let i = 0; i < wrappedLines.length; i++) {
            if (i >= totalLines) break;
            fullContent += `${i + 1}\t${wrappedLines[i]}\n`;
        }

        const remaining = totalLines - wrappedLines.length;
        if (remaining > 0) {
            for (let i = 0; i < remaining; i++) {
                fullContent += '~\n';
            }
        }

        Vim.preElement.textContent = fullContent;
    }

    static debounce(func, wait) {
        let timeout;
        return function (...args) {
            const later = () => {
                timeout = null;
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}
