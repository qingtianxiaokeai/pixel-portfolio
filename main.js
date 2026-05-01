const content = {
    cabin: "这是一间充满故事的像素木屋。里面存放着我的个人经历：从第一行代码到现在的 AI 训练师。",
    fire: "火光中闪烁着 AI 的灵感。这里展示了我的深度学习模型和各种生成艺术作品。",
    forest: "深邃的丛林里隐藏着瞬间的永恒。欢迎来到我的个人摄影画廊。",
    avatar: "你好，旅行者！我是一个热爱 RPG 的游戏狂热者，这里记录了我的游戏生涯。"
};

let isTyping = false;

function interact(type) {
    if (isTyping) return;
    const box = document.getElementById('dialogue-box');
    box.classList.remove('hidden');
    typeWriter(content[type], 'dialogue-text');
}

function typeWriter(text, elementId) {
    isTyping = true;
    let i = 0;
    const speed = 50;
    const element = document.getElementById(elementId);
    element.innerHTML = "";
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            isTyping = false;
        }
    }
    type();
}

document.getElementById('dialogue-box').onclick = function() {
    if (!isTyping) {
        this.classList.add('hidden');
    }
};
