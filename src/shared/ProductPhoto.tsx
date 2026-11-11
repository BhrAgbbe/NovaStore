"use client";

import Image from "next/image";
import styled from "styled-components";
import { isImageUrl } from "@/utils/format";
import Icon from "./Icon";

const Media = styled.div`
  position: relative;
  display: grid;
  place-items: center;
  overflow: hidden;
  background: #fff;
  color: #4e5d72;
  img {
    object-fit: contain;
    padding: 10px;
  }
`;

export default function ProductPhoto({
  src,
  alt = "",
  className,
}: {
  readonly src: string;
  readonly alt?: string;
  readonly className?: string;
}) {
  return (
    <Media className={className}>
      <Icon name="image" size={24} />
      {isImageUrl(src) && (
        <Image
          key={src}
          src={src}
          alt={alt}
          fill
          unoptimized
          sizes="(max-width: 900px) 100vw, 50vw"
          onError={(event) => {
            event.currentTarget.hidden = true;
          }}
        />
      )}
    </Media>
  );
}
