import React, { useState } from 'react';
import { LogOut, Trash2, Image, Plus, X, Eye, EyeOff } from 'lucide-react';

const LOOVBER = () => {
  const [page, setPage] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    profileImage: null,
  });
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showExtensionModal, setShowExtensionModal] = useState(false);
  const [htmlContent, setHtmlContent] = useState('');
  const [htmlName, setHtmlName] = useState('');
  const [selectedExtension, setSelectedExtension] = useState('');
  const [createdExtensions, setCreatedExtensions] = useState([]);
  const [sitesQuery, setSitesQuery] = useState('');
  const [selectedSite, setSelectedSite] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const colors = {
    orange: '#FF8C00',
    green: '#00AA00',
    blue: '#0066FF',
    yellow: '#FFD700',
    gray: '#808080',
    maroon: '#800000',
    aqua: '#00FFFF',
  };

  const logoColors = [colors.orange, colors.green, colors.blue, colors.yellow, colors.gray, colors.maroon, colors.aqua, colors.aqua];
  const logoText = 'LOOVBER';

  // Search API
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          messages: [{ role: 'user', content: `Kısaca ve öz olarak şu sorguya cevap ver: "${searchQuery}"` }],
        })
      });
      const data = await response.json();
      if (data.content && data.content[0]) {
        setSearchResults([{
          title: searchQuery,
          content: data.content[0].text,
          url: `loovber.com/search?q=${encodeURIComponent(searchQuery)}`
        }]);
        setPage('results');
      }
    } catch (error) {
      console.error('Search error:', error);
    }
    setIsLoading(false);
  };

  // Chat API
  const handleChatMessage = async () => {
    if (!chatInput.trim()) return;
    const userMessage = { role: 'user', content: chatInput };
    const newMessages = [...chatMessages, userMessage];
    setChatMessages(newMessages);
    setChatInput('');
    setChatLoading(true);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1500,
          system: 'Sen LOOVBER AI asistanısın. Metin biçimlendirmesi için markdown kullan. Emoji kullan ama abartma. Türkçe konuş. Samimi ve yardımcı ol.',
          messages: newMessages
        })
      });
      const data = await response.json();
      if (data.content && data.content[0]) {
        setChatMessages([...newMessages, { role: 'assistant', content: data.content[0].text }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setChatMessages([...newMessages, { role: 'assistant', content: '❌ Bir hata oluştu.' }]);
    }
    setChatLoading(false);
  };

  // Create Extension
  const handleCreateExtension = () => {
    if (!htmlContent.trim() || !selectedExtension || !htmlName.trim()) {
      alert('Lütfen tüm alanları doldurun!');
      return;
    }
    const extensionLabels = { 'loo': 'LOO', 'aar': 'AAR', 'bb': 'BB' };
    const newExtension = {
      id: Date.now(),
      siteName: htmlName,
      extensionType: selectedExtension,
      extensionLabel: extensionLabels[selectedExtension],
      html: htmlContent,
    };
    setCreatedExtensions([...createdExtensions, newExtension]);
    setShowExtensionModal(false);
    setHtmlContent('');
    setHtmlName('');
    setSelectedExtension('');
    alert(`"${htmlName} ${extensionLabels[selectedExtension]}" sitesi oluşturuldu!`);
  };

  // Logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser({ firstName: '', lastName: '', profileImage: null });
    setPage('home');
    setShowProfileMenu(false);
  };

  // Clear History
  const clearHistory = () => {
    alert('Arama geçmişi silindi!');
    setShowProfileMenu(false);
  };

  // Upload Profile Image
  const handleProfileImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser({ ...user, profileImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Profile Menu Component
  const ProfileMenu = () => (
    <div className="absolute right-0 top-12 bg-white rounded-lg shadow-xl border border-gray-200 w-48 z-50">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          {user.profileImage ? (
            <img src={user.profileImage} alt="Profil" className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </div>
          )}
          <div>
            <p className="font-bold text-sm">★ {user.firstName}</p>
            <p className="text-xs text-gray-600">{user.lastName}</p>
          </div>
        </div>
      </div>
      <button onClick={() => { setPage('profile'); setShowProfileMenu(false); }} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100">Profil</button>
      <div className="border-t border-gray-200 pt-2">
        <button onClick={() => { setPage('settings'); setShowProfileMenu(false); }} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100">⚙️ Profil Ayarları</button>
        <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100">📊 Aramalar</button>
        <button onClick={clearHistory} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100">🗑️ Geçmişi Sil</button>
      </div>
      <div className="border-t border-gray-200 pt-2 pb-2">
        <button onClick={handleLogout} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50">🚪 Çıkış Yap</button>
      </div>
    </div>
  );

  // HOME PAGE
  if (page === 'home') {
    return (
      <div style={{ fontSize: `${zoom}%` }} className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
        {/* Top Bar */}
        <div className="flex justify-between items-center p-4 bg-white border-b border-gray-200">
          <div className="flex gap-1">
            {logoText.split('').map((letter, i) => (
              <span key={i} style={{ color: logoColors[i], fontSize: '24px', fontWeight: 'bold' }}>
                {letter}
              </span>
            ))}
          </div>

          {createdExtensions.length > 0 && (
            <div className="flex-1 max-w-md mx-8 bg-white rounded-full shadow px-4 py-2 flex gap-2 border" style={{ borderColor: colors.aqua }}>
              <span style={{ color: colors.aqua }}>🌐</span>
              <input
                type="text"
                placeholder="Siteler'de ara..."
                value={sitesQuery}
                onChange={(e) => setSitesQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const found = createdExtensions.find(ext => `${ext.siteName} ${ext.extensionLabel}`.toLowerCase() === sitesQuery.toLowerCase());
                    if (found) {
                      setSelectedSite(found);
                      setPage('site');
                      setSitesQuery('');
                    } else {
                      alert('Site bulunamadı!');
                    }
                  }
                }}
                className="flex-1 outline-none text-sm"
              />
              <button
                onClick={() => {
                  const found = createdExtensions.find(ext => `${ext.siteName} ${ext.extensionLabel}`.toLowerCase() === sitesQuery.toLowerCase());
                  if (found) {
                    setSelectedSite(found);
                    setPage('site');
                    setSitesQuery('');
                  } else if (sitesQuery.trim()) {
                    alert('Site bulunamadı!');
                  }
                }}
                className="p-2 rounded-full hover:scale-110 transition-transform"
                style={{ backgroundColor: colors.aqua, color: 'white' }}
              >
                🔍
              </button>
            </div>
          )}

          <div className="flex gap-3">
            {!isLoggedIn ? (
              <>
                <button onClick={() => setShowLoginModal(true)} className="px-5 py-2 rounded-full text-sm font-semibold text-white" style={{ backgroundColor: colors.blue }}>
                  Giriş Yap
                </button>
                <button onClick={() => setShowSignupModal(true)} className="px-5 py-2 rounded-full text-sm font-semibold border-2" style={{ borderColor: colors.orange, color: colors.orange }}>
                  Hesap Aç
                </button>
              </>
            ) : (
              <div className="relative">
                <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center gap-2 px-3 py-1 rounded-full hover:bg-gray-100">
                  {user.profileImage ? (
                    <img src={user.profileImage} alt="Profil" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm" style={{ backgroundColor: colors.orange, color: 'white' }}>
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </div>
                  )}
                </button>
                {showProfileMenu && <ProfileMenu />}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-4">
          {/* Logo */}
          <div className="text-6xl font-black mb-8 tracking-wider">
            {logoText.split('').map((letter, i) => (
              <span key={i} style={{ color: logoColors[i] }}>{letter}</span>
            ))}
          </div>

          {/* Search Box */}
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-2 flex gap-2 items-center border-2" style={{ borderColor: colors.blue }}>
            <input
              type="text"
              placeholder="Ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 px-4 py-3 outline-none text-lg"
            />
            <button onClick={() => setIsPrivate(!isPrivate)} className="p-3 rounded-full" style={{ backgroundColor: isPrivate ? colors.orange : colors.gray, color: 'white' }}>
              {isPrivate ? '👁️' : '👁️‍🗨️'}
            </button>
            <button onClick={() => window.location.reload()} className="p-3 rounded-full hover:bg-gray-100">🔄</button>
            <button onClick={() => setZoom(Math.min(zoom + 10, 200))} className="p-3 rounded-full hover:bg-gray-100">➕</button>
            <button onClick={() => setZoom(Math.max(zoom - 10, 50))} className="p-3 rounded-full hover:bg-gray-100">➖</button>
            <button onClick={handleSearch} className="px-6 py-3 rounded-full text-white font-semibold text-sm" style={{ backgroundColor: colors.green }} disabled={isLoading}>
              {isLoading ? '⏳' : 'Ara!'}
            </button>
          </div>

          {isPrivate && <p className="mt-4 text-sm" style={{ color: colors.orange }}>🔒 Gizli Mod Aktif</p>}

          {/* Buttons */}
          <div className="mt-12 flex flex-col gap-4">
            <button onClick={() => setShowExtensionModal(true)} className="px-6 py-3 rounded-lg text-white font-semibold" style={{ backgroundColor: colors.maroon }}>
              {isLoggedIn ? '➕ İçerik Üret' : 'Hesap Açanlara İçerik Üret'}
            </button>
            <button onClick={() => setPage('chat')} className="px-6 py-3 rounded-lg text-white font-semibold flex items-center gap-2 justify-center" style={{ backgroundColor: colors.aqua }}>
              🤖 LOOVBER AI ile Sohbet
            </button>
          </div>
        </div>

        {/* Modals */}
        {showLoginModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full">
              <h2 className="text-2xl font-bold mb-6">Giriş Yap</h2>
              <input type="email" placeholder="E-mail" className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4" />
              <input type="password" placeholder="Şifre" className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-6" />
              <button onClick={() => { setIsLoggedIn(true); setShowLoginModal(false); setUser({ firstName: 'Kullanıcı', lastName: 'Test', profileImage: null }); }} className="w-full py-2 rounded-lg text-white font-semibold" style={{ backgroundColor: colors.blue }}>Giriş Yap</button>
              <button onClick={() => setShowLoginModal(false)} className="w-full mt-3 py-2 rounded-lg border border-gray-300">İptal</button>
            </div>
          </div>
        )}

        {showSignupModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full">
              <h2 className="text-2xl font-bold mb-6">Hesap Aç</h2>
              <input type="text" placeholder="Ad" className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4" onChange={(e) => setUser({ ...user, firstName: e.target.value })} />
              <input type="text" placeholder="Soyad" className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4" onChange={(e) => setUser({ ...user, lastName: e.target.value })} />
              <input type="email" placeholder="E-mail" className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4" />
              <input type="password" placeholder="Şifre" className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-6" />
              <button onClick={() => { if (user.firstName && user.lastName) { setIsLoggedIn(true); setShowSignupModal(false); } }} className="w-full py-2 rounded-lg text-white font-semibold" style={{ backgroundColor: colors.green }}>Hesap Aç</button>
              <button onClick={() => setShowSignupModal(false)} className="w-full mt-3 py-2 rounded-lg border border-gray-300">İptal</button>
            </div>
          </div>
        )}

        {showExtensionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">İçerik Üret</h2>
                <button onClick={() => setShowExtensionModal(false)} className="text-gray-500 hover:text-gray-700"><X size={24} /></button>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">Sitenin Adı:</label>
                <input type="text" value={htmlName} onChange={(e) => setHtmlName(e.target.value)} placeholder="Örn: MyPortfolio, BlogSitem..." className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">Uzantı Türü:</label>
                <div className="flex gap-4">
                  {[{ id: 'loo', name: 'LOO' }, { id: 'aar', name: 'AAR' }, { id: 'bb', name: 'BB' }].map(ext => (
                    <button key={ext.id} onClick={() => setSelectedExtension(ext.id)} className="px-4 py-2 rounded-lg border-2" style={{ backgroundColor: selectedExtension === ext.id ? colors.blue : 'transparent', borderColor: selectedExtension === ext.id ? colors.blue : '#D1D5DB', color: selectedExtension === ext.id ? 'white' : 'black' }}>
                      {ext.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">HTML İçeriği:</label>
                <textarea value={htmlContent} onChange={(e) => setHtmlContent(e.target.value)} placeholder="HTML kodunuzu buraya yazın..." className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg font-mono text-sm" />
              </div>
              <div className="flex gap-3">
                <button onClick={handleCreateExtension} className="flex-1 py-2 rounded-lg text-white font-semibold" style={{ backgroundColor: colors.green }}>Yayınla</button>
                <button onClick={() => setShowExtensionModal(false)} className="flex-1 py-2 rounded-lg border border-gray-300">İptal</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // CHAT PAGE
  if (page === 'chat') {
    return (
      <div style={{ fontSize: `${zoom}%` }} className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 flex flex-col">
        {/* Top Bar */}
        <div className="flex justify-between items-center p-4 bg-white border-b border-gray-200 sticky top-0 z-40">
          <button onClick={() => { setPage('home'); setChatMessages([]); }} className="flex gap-1 hover:opacity-80">
            {logoText.split('').map((letter, i) => (
              <span key={i} style={{ color: logoColors[i], fontSize: '20px', fontWeight: 'bold' }}>{letter}</span>
            ))}
          </button>
          <div className="flex items-center gap-3"><span className="text-xl">🤖</span><span className="font-bold">LOOVBER AI</span></div>
          <div className="flex gap-2">
            <button onClick={() => { setChatMessages([]); alert('Geçmiş temizlendi!'); }} className="px-4 py-2 rounded-lg hover:bg-gray-100">🗑️ Temizle</button>
            <button onClick={() => { setPage('home'); setChatMessages([]); }} className="px-4 py-2 rounded-lg text-white font-semibold" style={{ backgroundColor: colors.blue }}>← Geri</button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {chatMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-6xl mb-4">🤖</div>
              <h2 className="text-2xl font-bold mb-2">LOOVBER AI'a Hoş Geldin!</h2>
              <p className="text-gray-600 max-w-md">Sorular sor, fikirler paylaş, yardım iste... Her şey için buradayım! 💬</p>
            </div>
          ) : (
            chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-md lg:max-w-2xl px-5 py-3 rounded-2xl ${msg.role === 'user' ? 'text-white rounded-br-none' : 'bg-white border-2 rounded-bl-none'}`} style={{ backgroundColor: msg.role === 'user' ? colors.blue : 'white', borderColor: msg.role === 'user' ? colors.blue : colors.aqua }}>
                  <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))
          )}
          {chatLoading && (
            <div className="flex justify-start">
              <div className="bg-white border-2 px-5 py-3 rounded-2xl rounded-bl-none" style={{ borderColor: colors.aqua }}>
                <div className="flex gap-2"><span>⏳</span><span className="text-gray-600">Yazıyor...</span></div>
              </div>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="bg-white border-t border-gray-200 p-4 sticky bottom-0">
          <div className="max-w-4xl mx-auto flex gap-3">
            <input type="text" placeholder="LOOVBER AI'a bir şey sor... 💬" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && !chatLoading && handleChatMessage()} disabled={chatLoading} className="flex-1 px-4 py-3 border border-gray-300 rounded-full outline-none" />
            <button onClick={handleChatMessage} disabled={chatLoading || !chatInput.trim()} className="px-6 py-3 rounded-full text-white font-semibold transition-all" style={{ backgroundColor: colors.aqua }}>
              {chatLoading ? '⏳' : '📤'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // SITE PAGE
  if (page === 'site' && selectedSite) {
    return (
      <div style={{ fontSize: `${zoom}%` }} className="min-h-screen bg-gray-900 flex flex-col">
        <div className="flex justify-between items-center p-4 bg-white border-b border-gray-200 sticky top-0">
          <button onClick={() => setPage('home')} className="flex gap-1 hover:opacity-80">
            {logoText.split('').map((letter, i) => (
              <span key={i} style={{ color: logoColors[i], fontSize: '20px', fontWeight: 'bold' }}>{letter}</span>
            ))}
          </button>
          <div className="flex items-center gap-3 px-4 py-2 bg-gray-100 rounded-full">
            <span style={{ color: colors.aqua }}>🌐</span>
            <span className="font-semibold">{selectedSite.siteName}</span>
            <span style={{ color: colors.blue }} className="font-bold">{selectedSite.extensionLabel}</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setZoom(Math.min(zoom + 10, 200))} className="p-2 hover:bg-gray-100">➕</button>
            <button onClick={() => setZoom(Math.max(zoom - 10, 50))} className="p-2 hover:bg-gray-100">➖</button>
            <button onClick={() => { setPage('home'); setSelectedSite(null); }} className="px-4 py-2 rounded-full text-white font-semibold text-sm" style={{ backgroundColor: colors.blue }}>Geri</button>
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          <div dangerouslySetInnerHTML={{ __html: selectedSite.html }} className="w-full h-full" />
        </div>
      </div>
    );
  }

  // RESULTS PAGE
  if (page === 'results') {
    return (
      <div style={{ fontSize: `${zoom}%` }} className="min-h-screen bg-gray-100">
        <div className="flex justify-between items-center p-4 bg-white border-b border-gray-200 sticky top-0">
          <button onClick={() => setPage('home')} className="flex gap-1 hover:opacity-80">
            {logoText.split('').map((letter, i) => (
              <span key={i} style={{ color: logoColors[i], fontSize: '20px', fontWeight: 'bold' }}>{letter}</span>
            ))}
          </button>
          <div className="flex-1 max-w-xl mx-8 bg-white rounded-full shadow px-4 py-2 flex gap-2 border">
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSearch()} className="flex-1 outline-none text-sm" />
            <button onClick={handleSearch} disabled={isLoading}>{isLoading ? '⏳' : '🔍'}</button>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setZoom(Math.min(zoom + 10, 200))} className="p-2 hover:bg-gray-100">➕</button>
            <button onClick={() => setZoom(Math.max(zoom - 10, 50))} className="p-2 hover:bg-gray-100">➖</button>
          </div>
        </div>
        <div className="max-w-4xl mx-auto py-8 px-4">
          {searchResults.map((result, i) => (
            <div key={i} className="mb-8 bg-white p-6 rounded-lg shadow hover:shadow-lg">
              <h3 className="text-xl font-bold mb-2" style={{ color: colors.blue }}>{result.title}</h3>
              <p className="text-sm text-gray-500 mb-3">{result.url}</p>
              <p className="text-gray-700 leading-relaxed">{result.content}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // PROFILE PAGE
  if (page === 'profile') {
    return (
      <div style={{ fontSize: `${zoom}%` }} className="min-h-screen bg-gray-50">
        <div className="flex justify-between items-center p-4 bg-white border-b border-gray-200">
          <button onClick={() => setPage('home')} className="flex gap-1 hover:opacity-80">
            {logoText.split('').map((letter, i) => (
              <span key={i} style={{ color: logoColors[i], fontSize: '20px', fontWeight: 'bold' }}>{letter}</span>
            ))}
          </button>
          {isLoggedIn && (
            <div className="relative">
              <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center gap-3">
                {user.profileImage ? (
                  <img src={user.profileImage} alt="Profil" className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: colors.orange, color: 'white' }}>
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </div>
                )}
              </button>
              {showProfileMenu && <ProfileMenu />}
            </div>
          )}
        </div>
        <div className="max-w-2xl mx-auto py-12 px-4">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-8">Profil</h2>
            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200">
              {user.profileImage ? (
                <img src={user.profileImage} alt="Profil" className="w-24 h-24 rounded-full object-cover" />
              ) : (
                <div className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold" style={{ backgroundColor: colors.orange, color: 'white' }}>
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </div>
              )}
              <div className="flex-1"><h3 className="text-2xl font-bold">★ {user.firstName}</h3><p className="text-gray-600">{user.lastName}</p></div>
            </div>
            <button onClick={() => setPage('settings')} className="w-full px-6 py-3 rounded-lg text-white font-semibold" style={{ backgroundColor: colors.blue }}>Profil Ayarlarına Git</button>
          </div>
        </div>
      </div>
    );
  }

  // SETTINGS PAGE
  if (page === 'settings') {
    return (
      <div style={{ fontSize: `${zoom}%` }} className="min-h-screen bg-gray-50">
        <div className="flex justify-between items-center p-4 bg-white border-b border-gray-200">
          <button onClick={() => setPage('home')} className="flex gap-1 hover:opacity-80">
            {logoText.split('').map((letter, i) => (
              <span key={i} style={{ color: logoColors[i], fontSize: '20px', fontWeight: 'bold' }}>{letter}</span>
            ))}
          </button>
          <button onClick={() => setPage('profile')} className="text-gray-600 hover:text-gray-900">← Profil</button>
        </div>
        <div className="max-w-2xl mx-auto py-12 px-4">
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-bold mb-6">Profil Ayarları</h2>
            <div className="space-y-6">
              <div><label className="block text-sm font-semibold mb-2">Ad</label><input type="text" value={user.firstName} onChange={(e) => setUser({ ...user, firstName: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" /></div>
              <div><label className="block text-sm font-semibold mb-2">Soyad</label><input type="text" value={user.lastName} onChange={(e) => setUser({ ...user, lastName: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" /></div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <h3 className="text-xl font-bold mb-4">Tasarım</h3>
            <div>
              <label className="block text-sm font-semibold mb-3">Hesap Resmi Ekle</label>
              <label className="flex items-center justify-center px-6 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400">
                <input type="file" accept="image/*" onChange={handleProfileImageUpload} className="hidden" />
                <div className="text-center"><Image size={32} className="mx-auto mb-2" style={{ color: colors.blue }} /><p className="text-sm font-semibold">Resim Yükle</p><p className="text-xs text-gray-600">PNG, JPG veya GIF</p></div>
              </label>
              {user.profileImage && (
                <div className="mt-4"><p className="text-sm font-semibold mb-2">Ön İzleme:</p><img src={user.profileImage} alt="Preview" className="w-20 h-20 rounded-full object-cover" /></div>
              )}
            </div>
          </div>
          <button onClick={() => setPage('profile')} className="w-full px-6 py-3 rounded-lg text-white font-semibold" style={{ backgroundColor: colors.green }}>Geri Dön</button>
        </div>
      </div>
    );
  }
};

export default LOOVBER;