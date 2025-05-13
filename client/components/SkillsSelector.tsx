import { TokenFormProps } from "../types/form";

const SKILLS = ['Co-founder', 'Dev', 'Design', 'Growth', 'Marketing', 'Other'];

export default function SkillsSelector({ form, onFormChange, disabled }: TokenFormProps) {
    const handleCheck = (skill: string) => {
        const next = form.needs.includes(skill) 
            ? form.needs.filter(n => n !== skill) 
            : [...form.needs, skill];
        onFormChange('needs', next);
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-meme-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Looking for:
                </div>
            </label>
            <div className="grid grid-cols-2 gap-2">
                {SKILLS.map(skill => (
                    <label
                        key={skill}
                        className={`relative flex items-center p-3 rounded-xl border cursor-pointer ${
                            disabled ? 'opacity-50 cursor-not-allowed' : ''
                        } ${
                            form.needs.includes(skill)
                                ? 'border-meme-blue bg-meme-blue bg-opacity-10'
                                : 'border-gray-300 hover:border-meme-blue'
                        }`}
                    >
                        <input
                            type="checkbox"
                            className="sr-only"
                            disabled={disabled}
                            checked={form.needs.includes(skill)}
                            onChange={() => handleCheck(skill)}
                        />
                        <span className="ml-3 text-sm font-medium text-gray-700">
                            {skill}
                        </span>
                    </label>
                ))}
            </div>
        </div>
    );
} 