import Image, { ImageProps } from "next/image";

interface ExternalImageProps extends ImageProps {
  src: string;
}

const ExternalImage: React.FC<ExternalImageProps> = ({ src, ...props }) => {
  return (
    <Image
      src={`https://res.cloudinary.com/de4tlervo/image/fetch/${src}`}
      {...props}
    />
  );
};

export default ExternalImage;
