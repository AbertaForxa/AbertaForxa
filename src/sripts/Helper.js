export class Helper {
    static get_full_path_string(node) {
        if (!node.parent) return '~';

        const pathParts = [];
        let currentNode = node;
        while (currentNode?.parent) {
            pathParts.push(currentNode.path);
            currentNode = currentNode.parent;
        }

        pathParts.reverse();
        return `~/${pathParts.join('/')}`;
    }
    static find_node_by_path_and_level(path, level, node) {
        if (node.path === path && node.level === level) return node;
        if (node.children) {
            for (const child of node.children) {
                const result = Helper.find_node_by_path_and_level(
                    path,
                    level,
                    child,
                );
                if (result) return result;
            }
        }
        return null;
    }

    static build_tree_with_parents(node, parent = null) {
        node.parent = parent;
        if (node.children && node.children.length > 0) {
            node.children.forEach((child) =>
                Helper.build_tree_with_parents(child, node),
            );
        }
    }

    static animate_progress_bar() {
        const progressText = document.getElementById('progressText');
        const progressDiv = document.getElementById('progressDiv');

        const totalBars = 40;
        const maxPercent = 100;
        let currentPercent = 0;
        let currentBars = 0;

        const increment = 1;
        const intervalTime = 850;

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
