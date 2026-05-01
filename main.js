var ASSET_BASE_URL = 'images/';

document.addEventListener('DOMContentLoaded', function() {
    hidePreloader();
    initNavbar();
    initMobileNav();
    initScrollAnimations();
    initScrollProgress();
    initParallax();
    initBlog();
    initCarousel();
});

/* 隐藏加载动画 */
function hidePreloader() {
    var preloader = document.getElementById('preloader');
    if (!preloader) return;
    window.addEventListener('load', function() {
        setTimeout(function() {
            preloader.classList.add('hide');
        }, 600);
    });
    // 备用：3秒后自动隐藏
    setTimeout(function() {
        preloader.classList.add('hide');
    }, 3000);
}

/* 导航栏 */
function initNavbar() {
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

/* 移动端导航 */
function initMobileNav() {
    const toggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (!toggle || !navLinks) return;

    toggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        toggle.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('active');
            toggle.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

/* 分页器交互 */
function initPagination() {
    const dots = document.querySelectorAll('.page-dot');
    const items = document.querySelectorAll('.selection-item');
    if (!dots.length || !items.length) return;

    const perPage = 3;
    const totalPages = Math.ceil(items.length / perPage);

    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            dots.forEach(d => d.classList.remove('active'));
            this.classList.add('active');

            items.forEach((item, i) => {
                const page = Math.floor(i / perPage);
                if (page === index) {
                    item.style.display = '';
                    setTimeout(() => item.classList.add('visible'), 50);
                } else {
                    item.classList.remove('visible');
                    setTimeout(() => { item.style.display = 'none'; }, 300);
                }
            });
        });
    });

    // 触发第一页
    if (dots[0]) dots[0].click();
}

/* 滚动动画 */
function initScrollAnimations() {
    window.blogObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                window.blogObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll(
        '.selection-item, .section-title, ' +
        '.story-lead, .story-body, .story-image, ' +
        '.contact-text, .contact-email, .section-num, ' +
        '.gallery-scroll-controls, .blog-entry, .blog-title, .blog-excerpt, .blog-date, ' +
        '.portfolio-item--empty, .portfolio-message'
    ).forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
        window.blogObserver.observe(el);
    });
}

/* 视差滚动 - 停用以保证 GIF 清晰度 */
function initParallax() {
    // 留空，需要时可开启
}

/* 相册滚动 */
function initCarousel() {
    var STORAGE_KEY = 'qingtian_cabin_photos';
    var defaultPhotos = [
        { src: ASSET_BASE_URL + 'ba5585814c8afe949d10e248d6f07df5.jpg' },
        { src: ASSET_BASE_URL + '62fbd4896ac0556d18c6f78f117269ad.jpg' },
        { src: ASSET_BASE_URL + 'c1aaf470cec4f02001325e9881ab44fc.jpg' },
        { src: ASSET_BASE_URL + 'e91057f28d7735e505381f424f31d117.jpg' },
        { src: ASSET_BASE_URL + 'fa66a4e45444c9ad9c9c4d1bc61fbfef.jpg' },
        { src: ASSET_BASE_URL + '下载(1).jpg' }
    ];

    var track = document.getElementById('gallery-scroll-track');
    var playBtn = document.getElementById('gallery-scroll-play');
    var editBtn = document.getElementById('gallery-scroll-edit');
    var scrollEl = document.getElementById('gallery-scroll');

    if (!track) return;

    var photos = [];
    var isPlaying = true;

    function loadPhotos() {
        var saved = localStorage.getItem(STORAGE_KEY);
        if (saved) { try { photos = JSON.parse(saved); } catch(e) { photos = defaultPhotos.slice(); } }
        else { photos = defaultPhotos.slice(); }
        if (!photos.length) photos = defaultPhotos.slice();
    }

    function savePhotos() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(photos)); } catch(e) {} }
    function esc(s) { var d = document.createElement('div'); d.appendChild(document.createTextNode(s)); return d.innerHTML; }

    function renderTrack() {
        if (!photos.length) { track.innerHTML = '<p style="padding:2rem;text-align:center;color:var(--text-muted);font-weight:300;">暂无照片，点击"管理相册"添加</p>'; return; }
        var html = '';
        for (var repeat = 0; repeat < 2; repeat++) {
            for (var i = 0; i < photos.length; i++) {
                html += '<div class="gallery-scroll-item"><img src="' + esc(photos[i].src) + '" alt="" onerror="this.style.border=\'2px solid red\';this.style.background=\'rgba(255,0,0,0.08)\'"></div>';
            }
        }
        // 先停动画，写入新内容，再用双帧 RAF 确保浏览器重启动画从 translateX(0) 开始
        track.style.animation = 'none';
        track.innerHTML = html;
        requestAnimationFrame(function() {
            requestAnimationFrame(function() {
                track.style.animation = 'scrollGallery 30s linear infinite';
                track.style.animationPlayState = isPlaying ? 'running' : 'paused';
            });
        });
    }

    function togglePlay(play) {
        isPlaying = play !== undefined ? play : !isPlaying;
        if (playBtn) playBtn.textContent = isPlaying ? '⏸' : '▶';
        track.style.animationPlayState = isPlaying ? 'running' : 'paused';
    }

    // 播放按钮
    if (playBtn) playBtn.addEventListener('click', function() { togglePlay(); });

    // 悬停暂停
    if (scrollEl) {
        scrollEl.addEventListener('mouseenter', function() { if (isPlaying) track.style.animationPlayState = 'paused'; });
        scrollEl.addEventListener('mouseleave', function() { if (isPlaying) track.style.animationPlayState = 'running'; });
    }

    // 管理弹窗
    var modal = document.getElementById('gallery-modal');
    var closeBtn = document.getElementById('gallery-modal-close');
    var manageList = document.getElementById('gallery-manage-list');
    var addInput = document.getElementById('gallery-add-input');
    var addBtn = document.getElementById('gallery-add-btn');

    if (editBtn) editBtn.addEventListener('click', function() { renderManageList(); modal.classList.add('active'); });
    if (closeBtn) closeBtn.addEventListener('click', function() { modal.classList.remove('active'); });
    if (modal) modal.addEventListener('click', function(e) { if (e.target === modal) modal.classList.remove('active'); });

    function renderManageList() {
        if (!manageList) return;
        var html = '';
        for (var i = 0; i < photos.length; i++)
            html += '<div class="gallery-manage-item"><img src="' + esc(photos[i].src) + '" alt=""><span class="gmi-label">照片 ' + (i+1) + '</span><button class="gmi-del" data-index="' + i + '">&times;</button></div>';
        manageList.innerHTML = html;
        manageList.querySelectorAll('.gmi-del').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var idx = parseInt(this.getAttribute('data-index'));
                photos.splice(idx, 1); savePhotos();
                renderManageList(); renderTrack();
            });
        });
    }

    if (addBtn && addInput) {
        addBtn.addEventListener('click', function() {
            var val = addInput.value.trim(); if (!val) return;
            var src = val.indexOf('/') === -1 && val.indexOf('\\') === -1 && val.indexOf('.') > 0 ? ASSET_BASE_URL + val : val;
            photos.unshift({ src: src }); savePhotos(); addInput.value = ''; renderManageList(); renderTrack();
        });
        addInput.addEventListener('keydown', function(e) { if (e.key === 'Enter') addBtn.click(); });
    }

    // 文件上传
    var uploadInput = document.getElementById('gallery-upload-input');
    var uploadBtn = document.getElementById('gallery-upload-btn');

    if (uploadBtn && uploadInput) {
        uploadBtn.addEventListener('click', function() {
            var file = uploadInput.files[0];
            if (!file) return;
            if (!file.type.match(/^image\//)) { alert('请选择图片文件'); return; }
            var reader = new FileReader();
            reader.onload = function(e) {
                photos.unshift({ src: e.target.result }); savePhotos(); uploadInput.value = ''; renderManageList(); renderTrack();
            };
            reader.readAsDataURL(file);
        });
    }

    loadPhotos(); renderTrack();
}

/* 博客管理 */
function initBlog() {
    var list = document.getElementById('blog-list');
    var addBtn = document.getElementById('blog-add-btn');
    var modal = document.getElementById('blog-modal');
    var closeBtn = modal.querySelector('.blog-modal-close');
    var saveBtn = document.getElementById('blog-save-btn');
    var dateInput = document.getElementById('blog-input-date');
    var titleInput = document.getElementById('blog-input-title');
    var contentInput = document.getElementById('blog-input-content');

    if (!list) return;

    var STORAGE_KEY = 'qingtian_cabin_blog_posts';

    var defaultPosts = [
        { date: '2025.03.21', title: '春分日', content: '天气开始慢慢回暖了。窗外的树冒了新芽，早晨的阳光照进房间的角度也渐渐变得柔和。冲了一杯热茶，坐在窗边发呆，觉得这样的日子也很好。' },
        { date: '2025.02.14', title: '最近在听什么', content: '这一周循环播放的是菅野洋子的旧专辑。每首曲子都像在讲述一个故事，做饭的时候、走路的时候、看书的时候，背景音让日常多了些电影感。' },
        { date: '2025.01.08', title: '年末整理', content: '趁着假期把书桌和书架重新整理了一遍。丢掉了一些不再需要的东西，把常用的物件放在顺手的位置。整理完坐下来，觉得空气都清新了一些。新的一年，从整理开始。' },
        { date: '2024.12.15', title: '冬日的治愈食物', content: '天冷的时候总想吃点热乎的。最近爱上了自己煮味噌汤，白味噌打底，加豆腐、海带和一点葱花。捧着碗的时候，掌心都是暖的。简单的东西往往最治愈。' }
    ];

    function getPosts() {
        var saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try { return JSON.parse(saved); } catch(e) { return defaultPosts; }
        }
        return defaultPosts;
    }

    function savePosts(posts) {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(posts)); } catch(e) {}
    }

    function renderPosts() {
        var posts = getPosts();
        var html = '';
        for (var i = 0; i < posts.length; i++) {
            html +=
                '<article class="blog-entry" data-index="' + i + '">' +
                    '<time class="blog-date">' + escHtml(posts[i].date) + '</time>' +
                    '<div class="blog-content">' +
                        '<h3 class="blog-title">' + escHtml(posts[i].title) + '</h3>' +
                        '<p class="blog-excerpt">' + escHtml(posts[i].content) + '</p>' +
                    '</div>' +
                    '<button class="blog-del-btn" data-index="' + i + '">&times;</button>' +
                '</article>';
        }
        list.innerHTML = html;

        // 删除事件
        list.querySelectorAll('.blog-del-btn').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                var idx = parseInt(this.getAttribute('data-index'));
                var posts = getPosts();
                posts.splice(idx, 1);
                savePosts(posts);
                renderPosts();
                e.stopPropagation();
            });
        });

        // 重新触发滚动动画
        if (window.blogObserver) {
            list.querySelectorAll('.blog-entry, .blog-title, .blog-excerpt, .blog-date').forEach(function(el) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
                window.blogObserver.observe(el);
            });
        }
    }

    function escHtml(str) {
        var d = document.createElement('div');
        d.appendChild(document.createTextNode(str));
        return d.innerHTML;
    }

    // 添加按钮 - 打开弹窗
    if (addBtn) {
        addBtn.addEventListener('click', function() {
            dateInput.value = '';
            titleInput.value = '';
            contentInput.value = '';
            modal.classList.add('active');
        });
    }

    // 关闭弹窗
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.classList.remove('active');
        });
    }

    // 点击遮罩关闭
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) modal.classList.remove('active');
        });
    }

    // 保存新文章
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            var date = dateInput.value.trim();
            var title = titleInput.value.trim();
            var content = contentInput.value.trim();
            if (!date || !title || !content) { alert('请填写完整'); return; }
            var posts = getPosts();
            posts.unshift({ date: date, title: title, content: content });
            savePosts(posts);
            renderPosts();
            modal.classList.remove('active');
        });
    }

    // 初始渲染
    renderPosts();
}

/* 滚动进度条 */
function initScrollProgress() {
    const bar = document.createElement('div');
    bar.style.cssText = 'position:fixed;top:0;left:0;height:1px;background:#a89880;z-index:200;width:0;transition:width 0.1s ease;pointer-events:none;';
    document.body.appendChild(bar);

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (scrollTop / docHeight) * 100 + '%';
    });
}
