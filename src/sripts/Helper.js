export class Helper {
    static animate_progress_bar() {
        const progressText = document.getElementById('progressText');
        const progressDiv = document.getElementById('progressDiv');

        const totalBars = 40;
        const maxPercent = 100;
        let currentPercent = 0;
        let currentBars = 0;

        const increment = 1;
        const intervalTime = 650;

        setInterval(() => {
            progressText.textContent = `$ ${Math.round(currentPercent)}% [`;

            let bar = '';
            for (let i = 0; i < totalBars; i++) {
                if (i < currentBars) {
                    bar += '=';
                } else if (i === currentBars) {
                    bar += '>';
                } else {
                    bar += ' ';
                }
            }
            progressText.textContent += bar + ']';
            progressDiv.style.width = `${(currentPercent / maxPercent) * 100}%`;

            currentPercent += increment;
            currentBars = Math.floor((currentPercent / maxPercent) * totalBars);

            if (currentPercent > maxPercent) {
                currentPercent = 0;
                currentBars = 0;
            }
        }, intervalTime);
    }

    static always_focus_on_command_input() {
        document.addEventListener('click', (event) => {
            const contenteditable = document.getElementById('commandInput');

            if (!event.target.closest('#commandInput')) {
                contenteditable.focus();
            }
        });
    }
}
