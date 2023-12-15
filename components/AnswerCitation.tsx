import { cn } from '../utils/cn';
import { usePageContext } from '../utils/usePageContext';

type Props = {
  reference: string;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
};

export const AnswerCitation = ({ reference }: Props) => {
  const { selectedCitation, setSelectedCitation } = usePageContext();

  return (
    <a
      href={selectedCitation === `${reference}` ? `#${reference}` : undefined}
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
          'px-[6px] relative -top-[2px] rounded-sm bg-blue-100 text-sm font-semibold text-gray-600 hover:underline hover:bg-gray-900 hover:text-white transition ease-liner',
          selectedCitation === reference && 'bg-gray-900 text-white'
        )}
      >
        {reference}
      </button>
    </a>
  );
};
