import React, { FC, ReactNode } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import styles from "./iconbutton.module.css"


export type IconButtonPropsType = {
  icon: ReactNode;
  title?: string;
  disabled?: boolean
  onClick: () => void;
  className?: string
}

const IconButton: FC<IconButtonPropsType> = ({icon, title, disabled=false, className, ...props}) => {

  const { theme } = useTheme()

  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Button disabled={disabled} variant="ghost" size="icon" className={className} {...props}>
            {icon}
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className='bg-background px-2 py-1 border-2'>
            {title}
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}

export {IconButton}