import { cn } from '../utils/cn';
import { usePageContext } from '../utils/usePageContext';

type Props = {
  reference: string;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
};

export const AnswerCitation = ({ reference, onClick, ...rest }: Props) => {
  const { selectedCitation, setSelectedCitation } = usePageContext();

  return (
    <a
      href={`#${reference}`}
      onClick={() => {
        if (selectedCitation === `${reference}`) {
          setSelectedCitation(null);
        } else {
          setSelectedCitation(`${reference}`);
        }
      }}
    >
      {' '}
      <button
        className={cn(
          'px-[6px] relative -top-[2px] rounded-sm bg-slate-200 text-sm font-bold text-gray-600 hover:underline hover:bg-slate-300 transition ease-liner',
          selectedCitation === reference && 'bg-blue-700 text-white'
        )}
        onClick={onClick}
        {...rest}
      >
        {reference}
      </button>
    </a>
  );
};
