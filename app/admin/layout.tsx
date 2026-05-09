import { PropsWithChildren } from 'react'
import { MainSidebar } from './components/mainSidebar'

export default async function Layout({ children }: PropsWithChildren) {

  return (
    <div className="flex">
      <MainSidebar/>
      <main>{children}</main>
    </div>
  )
}