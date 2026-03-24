// app/layout.js
import './globals.css';

// SEO元数据（纯JS版本，移除TypeScript类型注解）
export const metadata = {
  title: '实用小工具合集 - 免费好用的日常工具',
  keywords: '实用小工具,字数统计,二维码生成,时间戳转换,免费工具',
  description: '免费好用的实用小工具合集，包含字数统计、二维码生成、时间戳转换等工具，无需下载，在线即用！',
  charset: 'UTF-8',
  viewport: 'width=device-width, initial-scale=1.0',
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN" >
      {/* 引入二维码生成库（解决QRCode未定义问题） */}
      <head>
        <script src="https://cdn.bootcdn.net/ajax/libs/qrcodejs/1.0.0/qrcode.min.js" async></script>
      </head>
      <body>
        {/* 百度统计脚本 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              var _hmt = _hmt || [];
              (function () {
                var hm = document.createElement("script");
                hm.src = "https://hm.baidu.com/hm.js?718b1393e46193d3d0e56f399fc7f266";
                var s = document.getElementsByTagName("script")[0];
                s.parentNode.insertBefore(hm, s);
              })();
            `,
          }}
        />
        <header>
          <div className="header-container">
            <div className="header-main">
              <a href="#" className="logo" id="home-btn">实用小工具合集</a>
              {/* 翻页时钟DOM */}
              <div className="flip-clock">
                <div className="flip-digit" data-digit="1">
                  <div className="top">1</div>
                  <div className="bottom">1</div>
                </div>
                <div className="flip-digit" data-digit="0">
                  <div className="top">0</div>
                  <div className="bottom">0</div>
                </div>
                <span className="flip-colon">:</span>
                <div className="flip-digit" data-digit="5">
                  <div className="top">5</div>
                  <div className="bottom">5</div>
                </div>
                <div className="flip-digit" data-digit="1">
                  <div className="top">1</div>
                  <div className="bottom">1</div>
                </div>
                <span className="flip-colon">:</span>
                <div className="flip-digit" data-digit="0">
                  <div className="top">0</div>
                  <div className="bottom">0</div>
                </div>
                <div className="flip-digit" data-digit="5">
                  <div className="top">5</div>
                  <div className="bottom">5</div>
                </div>
              </div>
            </div>
            <span 
              className="header-tag" 
              style={{ 
                fontFamily: "system-ui, -apple-system, sans-serif, emoji",
                fontVariantEmoji: "emoji" // 强制emoji渲染
              }}
            >
              🆓 easy to use
            </span>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}