import React, { useState, useEffect } from 'react';

interface DisclaimerModalProps {
  onAccept: () => void;
}

const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ onAccept }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem('disclaimer_accepted');
    if (!hasAccepted) {
      setIsOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('disclaimer_accepted', 'true');
    setIsOpen(false);
    onAccept();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gray-800 border-2 border-orange-500 rounded-lg max-w-lg w-full shadow-2xl transform transition-all scale-100">
        <div className="bg-orange-600 p-4 rounded-t-lg">
          <h2 className="text-2xl font-bold text-white text-center">NOTICE & DISCLAIMER</h2>
        </div>
        <div className="p-6 text-gray-200 text-sm leading-relaxed space-y-4 max-h-[60vh] overflow-y-auto">
          <p>
            <strong>DISCLAIMER:</strong> This game is a work of political satire and parody created purely for entertainment purposes. 
            The characters depicted are fictional caricatures inspired by public figures and are used within the context of political parody, 
            which is protected under freedom of expression and speech.
          </p>
          <p>
            This game does not represent, endorse, or reflect the views, policies, or positions of any political party, organization, 
            or individual. Any resemblance to actual persons is used in the context of satirical commentary on public political life.
          </p>
          <p>
            The creators do not intend to defame, harm, or disrespect any individual. Players should understand this content as 
            humorous social commentary.
          </p>
          <p className="font-semibold text-orange-300">
            By proceeding, you acknowledge that you understand the satirical nature of this content.
          </p>
        </div>
        <div className="p-4 bg-gray-900 rounded-b-lg flex justify-center">
          <button
            onClick={handleAccept}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full transition-colors shadow-lg active:transform active:scale-95"
          >
            I Understand & Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerModal;