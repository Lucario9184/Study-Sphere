/**
 * STUDYSPHERE — STUDY AI ASSISTANT CONTROLLER (js/study-ai.js)
 * Clean, lightweight client-side demo study assistant.
 * 
 * IMPORTANT HACKATHON CONTEXT:
 * This assistant simulates intelligent AI responses for first-year college
 * academic queries using keyword extraction and a curated knowledge base.
 * No external API keys or backends are required, ensuring 100% offline reliability.
 */

// --- 1. CURATED ACADEMIC KNOWLEDGE BASE ---
const ACADEMIC_KNOWLEDGE_BASE = [
  {
    topic: "Photoelectric Effect",
    keywords: ["photoelectric", "einstein", "threshold frequency", "stopping potential", "work function", "photon emission"],
    response: `The <strong>Photoelectric Effect</strong> is the phenomenon where electrons are emitted from a metal surface when light (electromagnetic radiation) of sufficiently high frequency strikes it.<br><br>
<strong>Key Principles:</strong><br>
• <em>Einstein's Equation:</em> \(E_k = h\nu - \Phi\), where \(h\nu\) is photon energy and \(\Phi\) is the metal's work function.<br>
• Emission is instantaneous and occurs only if the incident frequency \(\nu \ge \nu_0\) (threshold frequency).<br>
• Increasing light intensity increases the <em>number</em> of emitted photoelectrons, but does not increase their kinetic energy.<br><br>
📚 <em>Related Resource in StudySphere:</em> Check out <strong>Photoelectric Effect Notes & Formulas</strong> under Engineering Physics!`
  },
  {
    topic: "Matrices & Linear Algebra",
    keywords: ["matrix", "matrices", "rank", "echelon", "linear equations", "gauss jordan", "determinant"],
    response: `A <strong>Matrix</strong> is a rectangular array of numbers arranged in rows and columns. In first-year engineering, matrices are essential for solving simultaneous linear equations.<br><br>
<strong>Key Concepts:</strong><br>
• <em>Rank of a Matrix:</em> The maximum number of linearly independent row or column vectors, found by reducing the matrix to Row Echelon Form.<br>
• <em>System Consistency:</em> A system \(AX = B\) is consistent if \( \text{Rank}(A) = \text{Rank}([A|B]) \). If rank equals the number of variables, a unique solution exists.<br><br>
📐 <em>Related Resource:</em> See <strong>Matrices & System of Linear Equations</strong> under Engineering Mathematics.`
  },
  {
    topic: "Eigenvalues and Eigenvectors",
    keywords: ["eigenvalue", "eigenvalues", "eigenvector", "eigenvectors", "characteristic equation", "cayley-hamilton"],
    response: `For a square matrix \(A\), an <strong>Eigenvalue</strong> \(\lambda\) and corresponding non-zero <strong>Eigenvector</strong> \(X\) satisfy:<br>
\[ A X = \lambda X \quad \implies \quad (A - \lambda I)X = 0 \]<br>
<strong>How to Solve:</strong><br>
1. Set the characteristic determinant \(|A - \lambda I| = 0\) to find the roots \(\lambda\).<br>
2. Substitute each \(\lambda\) back into \((A - \lambda I)X = 0\) to solve for vector \(X\).<br>
3. <em>Cayley-Hamilton Theorem:</em> Every square matrix satisfies its own characteristic equation!`
  },
  {
    topic: "Kirchhoff's Laws",
    keywords: ["kirchhoff", "kvl", "kcl", "junction rule", "loop rule", "nodal"],
    response: `<strong>Kirchhoff's Laws</strong> are fundamental to DC and AC circuit analysis:<br><br>
1. <strong>Kirchhoff's Current Law (KCL - Junction Rule):</strong> The algebraic sum of currents entering any circuit node equals zero: \(\sum I = 0\). (Conservation of Electric Charge).<br>
2. <strong>Kirchhoff's Voltage Law (KVL - Loop Rule):</strong> The algebraic sum of all potential differences (voltages) around any closed loop is zero: \(\sum V = 0\). (Conservation of Energy).<br><br>
⚡ <em>Related Resource:</em> Watch the <strong>Kirchhoff's Laws Explained</strong> video lecture in Electrical Engineering.`
  },
  {
    topic: "Ohm's Law",
    keywords: ["ohm", "ohm's law", "resistance", "voltage", "current"],
    response: `<strong>Ohm's Law</strong> states that the electric current \(I\) flowing through a conductor between two points is directly proportional to the potential difference (voltage \(V\)) across the two points, provided physical conditions (temperature) remain constant:<br>
\[ V = I \cdot R \]<br>
where \(R\) is the electrical resistance measured in Ohms (\(\Omega\)).`
  },
  {
    topic: "C Programming Basics",
    keywords: ["c programming", "c language", "printf", "scanf", "data types", "variables in c"],
    response: `<strong>C Language Basics:</strong> C is a procedural, statically typed programming language developed by Dennis Ritchie at Bell Labs.<br><br>
<strong>Core Elements:</strong><br>
• <em>Data Types:</em> <code>int</code> (4 bytes), <code>float</code> (4 bytes), <code>char</code> (1 byte), <code>double</code> (8 bytes).<br>
• <em>I/O Functions:</em> <code>printf()</code> displays formatted output, while <code>scanf()</code> reads user input using format specifiers like <code>%d</code>, <code>%f</code>, and <code>%s</code>.<br>
• <em>Structure:</em> Every executable C program must contain the <code>main()</code> function entry point.<br><br>
💻 <em>Related Resource:</em> Check out <strong>C Programming Basics & Syntax Guide</strong> in our catalog.`
  },
  {
    topic: "Arrays and Functions in C",
    keywords: ["array", "arrays", "functions", "recursion", "parameters", "call by value"],
    response: `<strong>Arrays & Functions in C:</strong><br><br>
• <strong>Array:</strong> A collection of similar data elements stored in contiguous memory locations. Indexing starts at <code>0</code> up to <code>size - 1</code>.<br>
• <strong>Functions:</strong> Reusable modular blocks of code that take inputs (arguments), execute statements, and return a result.<br>
• <strong>Recursion:</strong> A programming technique where a function calls itself to solve a smaller instance of the same problem, requiring a definite base case to prevent stack overflow.`
  },
  {
    topic: "Loops and Control Flow",
    keywords: ["loop", "loops", "for loop", "while loop", "do-while", "if-else", "switch"],
    response: `<strong>Control Flow in Programming:</strong><br><br>
• <em>Conditional Branching:</em> <code>if</code>, <code>if-else</code>, and <code>switch</code> evaluate boolean conditions to route code execution.<br>
• <em>Entry-Controlled Loops:</em> <code>for</code> and <code>while</code> loops check condition <em>before</em> executing loop body.<br>
• <em>Exit-Controlled Loop:</em> <code>do-while</code> executes the loop body at least once before checking the condition.`
  },
  {
    topic: "Differential Equations",
    keywords: ["differential equation", "differential equations", "integrating factor", "calculus", "exact differential", "order and degree"],
    response: `A <strong>Differential Equation</strong> relates a function with one or more of its derivatives.<br><br>
<strong>Key First-Year Essentials:</strong><br>
• <em>Order:</em> The order of the highest derivative in the equation.<br>
• <em>Degree:</em> The power of the highest order derivative after making radicals rational.<br>
• <em>First-Order Linear:</em> \(\frac{dy}{dx} + P(x)y = Q(x)\). Solved using Integrating Factor: \(IF = e^{\int P(x)dx}\).`
  },
  {
    topic: "Thevenin's and Norton's Theorems",
    keywords: ["thevenin", "norton", "superposition", "maximum power", "network theorem"],
    response: `<strong>Thevenin's Theorem:</strong> Any linear electrical network containing voltage sources and resistors can be replaced at terminals A-B by an equivalent single voltage source \(V_{th}\) in series with an equivalent resistance \(R_{th}\).<br><br>
<strong>Norton's Theorem:</strong> The dual theorem stating any linear network can be replaced by an equivalent current source \(I_N\) in parallel with \(R_N\). (\(R_{th} = R_N\)).`
  },
  {
    topic: "Thermodynamics & Phase Rule",
    keywords: ["thermodynamics", "entropy", "gibbs", "enthalpy", "phase rule", "free energy"],
    response: `<strong>Chemical Thermodynamics:</strong><br><br>
• <em>First Law:</em> Conservation of energy: \(\Delta U = q + w\).<br>
• <em>Second Law:</em> The entropy of an isolated system always increases: \(\Delta S_{univ} > 0\).<br>
• <em>Gibbs Free Energy:</em> \(\Delta G = \Delta H - T\Delta S\). A process is spontaneous at constant T and P if \(\Delta G < 0\).<br>
• <em>Gibbs Phase Rule:</em> \(F = C - P + 2\), relating degrees of freedom \(F\), components \(C\), and phases \(P\).`
  }
];

// --- 2. MATCHING LOGIC ---
/**
 * Matches user query against the academic knowledge base
 * @param {string} userText 
 * @returns {string} Response HTML
 */
function findBestResponse(userText) {
  const cleanInput = (userText || '').toLowerCase().trim();

  // Easter egg: check for supreme leader
  if (cleanInput.includes("supreme leader")) {
    return "Mr.Bhavyam is the one and only supreme leader.";
  }

  // Handle common greetings
  if (/^(hi|hello|hey|greetings|help)\b/i.test(cleanInput)) {
    return `Hello! 👋 I'm the StudySphere academic demo assistant. You can ask me conceptual questions about <strong>Engineering Physics</strong>, <strong>Mathematics</strong>, <strong>C Programming</strong>, <strong>Electrical Circuits</strong>, or <strong>Chemistry</strong>!`;
  }

  // Score each topic in knowledge base based on matching keywords
  let bestTopic = null;
  let highestMatchScore = 0;

  for (const item of ACADEMIC_KNOWLEDGE_BASE) {
    let score = 0;

    // Check direct topic name
    if (cleanInput.includes(item.topic.toLowerCase())) {
      score += 5;
    }

    // Check individual keywords
    for (const kw of item.keywords) {
      if (cleanInput.includes(kw.toLowerCase())) {
        score += 2;
      }
    }

    if (score > highestMatchScore) {
      highestMatchScore = score;
      bestTopic = item;
    }
  }

  if (bestTopic && highestMatchScore >= 2) {
    return bestTopic.response;
  }

  // Fallback response for unhandled topics
  return `I'm currently a demo study assistant tailored for first-year engineering concepts. I couldn't find a direct match for your question.<br><br>
💡 <strong>Try asking about one of the supported topics:</strong><br>
• <em>"What is the photoelectric effect?"</em><br>
• <em>"Explain Kirchhoff's laws"</em><br>
• <em>"How do matrices and eigenvalues work?"</em><br>
• <em>"Explain C programming arrays and loops"</em><br>
• <em>"What is Thevenin's theorem?"</em><br>
• <em>"What is Gibbs free energy?"</em>`;
}

// --- 3. CHAT UI INTERACTION ---
document.addEventListener('DOMContentLoaded', () => {
  const chatMessages = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const chatSendBtn = document.getElementById('chat-send-btn');
  const clearChatBtn = document.getElementById('btn-clear-chat');
  const suggestionChips = document.querySelectorAll('.suggestion-chip');

  if (!chatMessages || !chatInput || !chatSendBtn) return;

  /**
   * Appends a message bubble to the chat container
   * @param {string} htmlContent 
   * @param {'assistant'|'user'} sender 
   */
  function appendMessage(htmlContent, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message ${sender}`;

    const avatarHtml = sender === 'assistant' 
      ? `<div class="chat-avatar-small bot">🤖</div>` 
      : `<div class="chat-avatar-small user">👤</div>`;

    msgDiv.innerHTML = `
      ${avatarHtml}
      <div class="chat-bubble">
        ${htmlContent}
      </div>
    `;

    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  /**
   * Displays temporary animated typing dots
   * @returns {HTMLElement} The typing indicator element
   */
  function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message assistant';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = `
      <div class="chat-avatar-small bot">🤖</div>
      <div class="chat-bubble" style="padding: 0.6rem 1rem;">
        <div class="typing-dots">
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
        </div>
      </div>
    `;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return typingDiv;
  }

  /**
   * Handles sending a question and generating an answer
   */
  function handleSendMessage(questionText) {
    const text = questionText || chatInput.value.trim();
    if (!text) return;

    // Append student's message
    appendMessage(escapeHtml(text), 'user');
    chatInput.value = '';

    // Show typing dots
    const typingEl = showTypingIndicator();

    // Simulated short response delay (500ms) for realistic UX
    setTimeout(() => {
      if (typingEl && typingEl.parentElement) {
        typingEl.remove();
      }
      const answer = findBestResponse(text);
      appendMessage(answer, 'assistant');
    }, 550);
  }

  // Event Listeners
  chatSendBtn.addEventListener('click', () => handleSendMessage());

  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  });

  // Suggestion chips
  suggestionChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.getAttribute('data-question') || chip.textContent.trim();
      handleSendMessage(q);
    });
  });

  // Clear chat
  if (clearChatBtn) {
    clearChatBtn.addEventListener('click', () => {
      chatMessages.innerHTML = `
        <div class="chat-message assistant">
          <div class="chat-avatar-small bot">🤖</div>
          <div class="chat-bubble">
            Chat cleared! How can I help you with your college studies today?
          </div>
        </div>
      `;
      showToast('Chat history cleared', 'info');
    });
  }
});
