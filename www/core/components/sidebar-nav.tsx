import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { Icon } from "reflexjs"
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
} from "@reach/accordion"

export interface NavItem {
  title: string
  url?: string
  external?: boolean
  items?: NavItem[]
}

export interface SidebarNavProps {
  items: NavItem[]
  onLinkClick?: () => void
}

export function SidebarNavItem({ items, onLinkClick }: SidebarNavProps) {
  const { asPath } = useRouter()

  const headingStyles = {
    w: "full",
    display: "flex",
    alignItems: "center",
    fontSize: "md",
    fontFamily: "body",
    cursor: "pointer",
    color: "text",
    _hover: {
      color: "link",
    },
  }

  return items?.length ? (
    <div>
      {items.map((item, index) => (
        <div key={index} mb="2">
          {item.url ? (
            <Link href={item.url} passHref>
              <a
                {...headingStyles}
                color={asPath === item.url ? "link" : "text"}
                onClick={onLinkClick}
                target={item.external && "_blank"}
                rel={item.external ? "noreferrer" : ""}
              >
                <Icon name="circle" size="2" ml="1" mr="3" opacity="0.5" />{" "}
                {item.title}
                {item.external && <Icon name="external" ml="2" size="3" />}
              </a>
            </Link>
          ) : null}
          {item.items?.length ? (
            <Accordion collapsible>
              <AccordionItem>
                <AccordionButton
                  sx={{
                    ...headingStyles,
                    "&[aria-expanded=true] > svg": {
                      transform: "rotate(90deg)",
                    },
                  }}
                >
                  <Icon name="chevron-right" size="4" mr="2" opacity="0.5" />
                  {item.title}
                </AccordionButton>
                <AccordionPanel
                  sx={{
                    pl: 4,
                    py: 2,
                    borderLeftWidth: 1,
                    ml: 2,
                  }}
                >
                  {item.items.map((_item, _index) => (
                    <Link href={_item.url} passHref key={_index}>
                      <a
                        display="flex"
                        fontSize="sm"
                        my="2"
                        color={asPath === _item.url ? "link" : "text"}
                        _hover={{
                          color: "link",
                        }}
                        onClick={onLinkClick}
                      >
                        - {_item.title}
                      </a>
                    </Link>
                  ))}
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          ) : null}
        </div>
      ))}
    </div>
  ) : null
}

export function SidebarNav({ items, onLinkClick }: SidebarNavProps) {
  return items.length ? (
    <div>
      {items.map((item, index) => (
        <div key={index}>
          <h4
            fontSize="lg"
            fontWeight="semibold"
            mb="4"
            mt={index !== 0 && 6}
            borderTopWidth={index !== 0 && 1}
            pt={index !== 0 && 4}
          >
            {item.title}
          </h4>
          <SidebarNavItem items={item.items} onLinkClick={onLinkClick} />
        </div>
      ))}
    </div>
  ) : null
}
