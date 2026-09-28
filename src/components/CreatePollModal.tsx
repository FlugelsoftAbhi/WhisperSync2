import React, { useState } from 'react';
import { X, Plus, Trash2, BarChart2 } from 'lucide-react';
import { useChat } from '../context/ChatContext';

interface CreatePollModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatePollModal: React.FC<CreatePollModalProps> = ({ isOpen, onClose }) => {
  const { sendMessage } = useChat();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [isMultipleChoice, setIsMultipleChoice] = useState(false);

  if (!isOpen) return null;

  const handleAddOption = () => {
    if (options.length < 8) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (text: string, index: number) => {
    const updated = [...options];
    updated[index] = text;
    setOptions(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanQuestion = question.trim();
    const validOptions = options.map((o) => o.trim()).filter(Boolean);

    if (!cleanQuestion || validOptions.length < 2) return;

    sendMessage(cleanQuestion, {
      type: 'poll',
      poll: {
        question: cleanQuestion,
        options: validOptions,
        isMultipleChoice,
      },
    });

    setQuestion('');
    setOptions(['', '']);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-4 px-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <BarChart2 className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-slate-100 text-sm">Create a Poll</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Question</label>
            <input
              type="text"
              required
              placeholder="Ask a question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-300">Options</label>
            {options.map((opt, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  required
                  placeholder={`Option ${index + 1}`}
                  value={opt}
                  onChange={(e) => handleOptionChange(e.target.value, index)}
                  className="flex-1 px-3.5 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(index)}
                    className="p-2 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}

            {options.length < 8 && (
              <button
                type="button"
                onClick={handleAddOption}
                className="mt-1 flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-medium py-1 px-2 hover:bg-emerald-950/40 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add option
              </button>
            )}
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs text-slate-300">Allow multiple answers</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isMultipleChoice}
                onChange={(e) => setIsMultipleChoice(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!question.trim() || options.filter((o) => o.trim()).length < 2}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:pointer-events-none text-white text-xs font-semibold rounded-lg shadow-lg shadow-emerald-600/20 transition-all"
            >
              Create Poll
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
