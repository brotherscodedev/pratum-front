import { FC, ReactNode } from "react";
import { Button } from "./ui/button";
import * as Tooltip from "@radix-ui/react-tooltip"

export type ActionBarItemType = {
  icon: ReactNode,
  title?: string,
  onClick: () => void
  disabled?: boolean
}

type ActionBarPropsType = {
  actions: ActionBarItemType[]
}

const ActionBar: FC<ActionBarPropsType> = ({ actions }) => {
  return (
    <div className="flex flex-row place-content-end px-5">
      <Tooltip.Provider>
          {actions.map((action, index) => (
            <Tooltip.Root key={index}>
              <Tooltip.Trigger asChild>
                <Button variant="ghost" onClick={action.onClick} size="icon" disabled={action.disabled}>
                  {action.icon}
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content className='bg-background px-2 py-1 border-2'>
                  {action.title}
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          ))}

      </Tooltip.Provider>
    </div>
  )
}

export default ActionBar;