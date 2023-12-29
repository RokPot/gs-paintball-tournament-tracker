interface IProps {
  className?: string;
}

const BracketsPreview: React.FC<IProps> = ({ className }) => {
  return <div className={className}> test</div>;
};

export default BracketsPreview;
