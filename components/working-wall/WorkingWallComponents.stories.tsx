import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Button } from "@/components/ui/button"
import { Tabs } from "@/components/ui/tabs"
import {
  MaterialSwatch,
  WorkingWallBoard,
  WorkingWallNote,
  WorkingWallPathCard,
  WorkingWallSeparator,
  WorkspaceTabsList,
  WorkspaceTabTrigger,
} from "./WorkingWallComponents"

function WorkingWallReference() {
  return (
    <main
      className="working-wall-stage grid max-w-5xl gap-8 p-6"
      data-grade="pre-school"
    >
      <Tabs defaultValue="today">
        <WorkspaceTabsList aria-label="Workspace navigation">
          <WorkspaceTabTrigger index={1} value="today">Today</WorkspaceTabTrigger>
          <WorkspaceTabTrigger index={2} value="curriculum">Curriculum</WorkspaceTabTrigger>
          <WorkspaceTabTrigger index={3} value="planner">Planner</WorkspaceTabTrigger>
          <WorkspaceTabTrigger index={4} value="resources">Resources</WorkspaceTabTrigger>
        </WorkspaceTabsList>
      </Tabs>

      <section className="grid gap-4 sm:grid-cols-3">
        <WorkingWallPathCard
          description="Compare, count, and sort."
          iconClass="math-building-icon"
          kicker="Mix & measure"
          title="A meaningful choice"
        />
        <WorkingWallNote fastener="pin" heading="Planning reminder">
          <p className="font-hand text-xl">Invite a choice and notice the story.</p>
        </WorkingWallNote>
        <WorkingWallNote fastener="clip" heading="Set a goal">
          Follow a simple sequence and make one meaningful choice.
        </WorkingWallNote>
      </section>

      <section className="flex flex-wrap gap-3">
        <Button>Build this lesson</Button>
        <Button variant="secondary">Browse learning paths</Button>
        <Button variant="link">View path →</Button>
      </section>

      <section className="grid gap-4">
        <WorkingWallSeparator treatment="dashed" />
        <WorkingWallSeparator treatment="paper" />
        <WorkingWallSeparator treatment="space" />
        <WorkingWallSeparator treatment="board" />
      </section>

      <WorkingWallBoard aria-label="Material specimens" className="grid sm:grid-cols-3">
        <MaterialSwatch label="Felt" materialClass="material-surface material-felt cast-old-macdonald" />
        <MaterialSwatch label="Cork" materialClass="material-surface material-cork" />
        <MaterialSwatch label="Paper" materialClass="material-surface material-cardboard-paper" />
      </WorkingWallBoard>
    </main>
  )
}

const meta = {
  title: "Working wall/Implementation components",
  component: WorkingWallReference,
  parameters: { layout: "centered" },
} satisfies Meta<typeof WorkingWallReference>

export default meta
type Story = StoryObj<typeof meta>

export const ImplementationKey: Story = {}
