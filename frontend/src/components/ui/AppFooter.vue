<template>
  <footer class="app-footer">
    <div class="container">
      <div class="row g-4 py-5">
        <div class="col-lg-4">
          <div class="footer-brand d-flex align-items-center mb-3">
            <i class="bi bi-mortarboard-fill me-2"></i>
            <span>校园生活服务平台</span>
          </div>
          <p class="footer-desc">
            为在校师生提供便捷、高效的校园生活服务，涵盖生活、学习、运动、餐饮、出行等方面。
          </p>
        </div>
        <div class="col-lg-2 col-md-4">
          <h6 class="footer-title">快速导航</h6>
          <ul class="footer-links">
            <li><router-link to="/">首页</router-link></li>
            <li><router-link to="/announcements">校园公告</router-link></li>
            <li><router-link to="/profile">个人中心</router-link></li>
          </ul>
        </div>
        <div class="col-lg-3 col-md-4">
          <h6 class="footer-title">服务分类</h6>
          <ul class="footer-links">
            <li><a href="javascript:void(0)">生活服务</a></li>
            <li><a href="javascript:void(0)">学习服务</a></li>
            <li><a href="javascript:void(0)">运动健康</a></li>
            <li><a href="javascript:void(0)">餐饮服务</a></li>
          </ul>
        </div>
        <div class="col-lg-3 col-md-4">
          <h6 class="footer-title">联系我们</h6>
          <ul class="footer-links footer-contact">
            <li><i class="bi bi-geo-alt me-2"></i>学校信息服务中心</li>
            <li><i class="bi bi-telephone me-2"></i>0571-88888000</li>
            <li><i class="bi bi-envelope me-2"></i>service@campus.edu.cn</li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2026 校园生活服务平台 · 刘志帅 · All Rights Reserved</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  background: var(--color-neutral-900);
  color: var(--color-neutral-400);
  margin-top: auto;
}

.footer-brand {
  color: white;
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 18px;
}

.footer-brand i {
  font-size: 24px;
  color: var(--color-primary);
}

.footer-desc {
  font-size: var(--font-size-sm);
  line-height: 1.7;
  max-width: 300px;
}

.footer-title {
  color: white;
  font-weight: 600;
  margin-bottom: 16px;
  font-size: var(--font-size-sm);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 8px;
}

.footer-links a {
  color: var(--color-neutral-400);
  font-size: var(--font-size-sm);
  transition: color var(--transition-fast);
}

.footer-links a:hover {
  color: white;
}

.footer-contact li {
  font-size: var(--font-size-sm);
  display: flex;
  align-items: center;
}

.footer-bottom {
  border-top: 1px solid var(--color-neutral-700);
  padding: 20px 0;
  text-align: center;
  font-size: var(--font-size-xs);
}
</style>
