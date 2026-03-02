import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentPlan, setCurrentPlan] = useState([]); 

  const handleSend = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    setCurrentPlan([]); 
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      
      
      if (data.plan) setCurrentPlan(data.plan);

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.response,
        plan: data.plan 
      }]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={{ color: '#1d1d1f', fontSize: '32px' }}>8051 Intelligence</h1>
        <p style={{ color: '#86868b' }}>Plan-and-Execute RAG Agent</p>
      </header>

      
      {loading && (
        <div style={styles.progressSection}>
          <div style={styles.spinner}></div>
          <div style={{ marginLeft: '10px' }}>
            <span style={styles.loadingText}>Agent is building a decision tree...</span>
          </div>
        </div>
      )}

      <div style={styles.chatBox}>
        {messages.map((m, i) => (
          <div key={i} style={m.role === 'user' ? styles.userRow : styles.assistantRow}>
            <div style={m.role === 'user' ? styles.userBubble : styles.assistantBubble}>
              {m.plan && m.plan.length > 0 && (
                <div style={styles.planSection}>
                  <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', fontSize: '10px', textTransform: 'uppercase' }}>Strategy Executed:</p>
                  <div style={styles.treeContainer}>
                    {m.plan.map((step, index) => (
                      <span key={index} style={styles.treeStep}>
                        {index + 1}. {step}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>{m.content}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.inputArea}>
        <input 
          style={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a complex 8051 question..."
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={loading}
        />
        <button 
          onClick={handleSend} 
          style={{...styles.button, opacity: loading ? 0.6 : 1}} 
          disabled={loading}
        >
          {loading ? 'Thinking...' : 'Ask Agent'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '850px', margin: '0 auto', padding: '40px 20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', backgroundColor: '#ffffff', minHeight: '100vh' },
  header: { textAlign: 'center', marginBottom: '40px' },
  progressSection: { display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', padding: '15px', borderRadius: '12px', backgroundColor: '#f5f5f7', border: '1px solid #d2d2d7' },
  loadingText: { fontSize: '14px', color: '#1d1d1f', fontWeight: '500' },
  spinner: { width: '16px', height: '16px', border: '2px solid #007aff', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
  chatBox: { minHeight: '500px', marginBottom: '30px' },
  userRow: { display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' },
  assistantRow: { display: 'flex', justifyContent: 'flex-start', marginBottom: '24px' },
  userBubble: { backgroundColor: '#007aff', color: '#fff', padding: '14px 20px', borderRadius: '20px 20px 4px 20px', maxWidth: '75%', boxShadow: '0 4px 12px rgba(0,122,255,0.15)' },
  assistantBubble: { backgroundColor: '#f5f5f7', color: '#1d1d1f', padding: '14px 20px', borderRadius: '20px 20px 20px 4px', maxWidth: '75%', border: '1px solid #e5e5e7' },
  planSection: { backgroundColor: 'rgba(0,0,0,0.05)', padding: '10px', borderRadius: '8px', marginBottom: '12px', fontSize: '12px' },
  treeContainer: { display: 'flex', flexDirection: 'column', gap: '4px' },
  treeStep: { display: 'block', color: '#515154' },
  inputArea: { display: 'flex', gap: '12px', position: 'sticky', bottom: '20px', backgroundColor: '#fff', padding: '10px 0' },
  input: { flex: 1, padding: '16px 20px', borderRadius: '14px', border: '1px solid #d2d2d7', fontSize: '16px', outline: 'none', transition: 'border 0.2s' },
  button: { padding: '16px 28px', borderRadius: '14px', border: 'none', backgroundColor: '#007aff', color: '#fff', cursor: 'pointer', fontWeight: '600', fontSize: '15px' },
};

