interface TitleProps {
  text: string;
}

const Title = ({ text }: TitleProps) => {
  return (
    <div className="relative mb-2 w-full text-medium font-medium text-secondary-light after:absolute  after:-bottom-[2px] after:left-0 after:h-[4px] after:w-full after:rounded-full after:bg-secondary-light after:content-[''] dark:text-secondary-dark dark:after:bg-secondary-dark">
      {text}
    </div>
  );
};

export default Title;
