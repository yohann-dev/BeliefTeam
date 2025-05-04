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
                Looking for:
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