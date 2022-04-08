import { ReactNode } from 'react'

import { TooltipResponse } from 'components/TooltipsDisplay'
import { DaoCreateData } from 'pages/dao/create'

// A type which maps each key of DaoCreateData to a react node. Updating a field
// name in DaoCreateData will cause type checking to fail until that field is
// added to `daoCreateTooltips` below.
type daoCreateTooltipsType = { [key in keyof DaoCreateData]: ReactNode }

const daoCreateTooltips: daoCreateTooltipsType = {
  deposit: (
    <p>
      The number of governance tokens that must be deposited in order to create
      a proposal in the DAO.
    </p>
  ),
  description: <p>A description of your DAO.</p>,
  duration: (
    <p>The amount of time a proposal can be voted on before being closed.</p>
  ),
  name: <p>The name of your DAO.</p>,
  threshold: <p>The percentage of yes votes needed for a proposal to pass.</p>,
  quorum: (
    <>
      <p>
        The percentage of total voting power that must turn out in order for a
        proposal to pass.
      </p>
      <p>
        When a proposal{"'"}s voting period is up and the quorum is met, the
        proposal passes if the percentage of yes votes to all those who voted is
        at least the threshold. For example, with a 33% quorum and a 50% passing
        threshold, if 20% of all possible voters voted yes and 13% of all
        possible voters voted no, the proposal would pass once the voting period
        ends. This is because 33% of all possible voters voted, and at least 50%
        were yes.
      </p>
      <p>
        With that same turnout but no quorum, the proposal would fail because
        less than 50% of all possible voters voted yes. We recommend using
        quorum mode if you are worried about low voter participation.
        Additionally, quorum mode with a quorum of 0% and threshold of 51% will
        enable plurality voting, where the proposal will pass if more voters
        vote yes.
      </p>
    </>
  ),
  tokenName: <p>The name of your DAO{"'"}s governance token.</p>,
  tokenSymbol: (
    <>
      <p>
        A shorthand symbol for your governance token. Similar to a stock ticker.
      </p>
      <p>
        If you ever list your token on an exchange this is the symbol it will
        trade under.
      </p>
    </>
  ),
  daoInitialBalance: (
    <>
      <p>
        The number of governance to allocate to your DAO{"'"}s treasury.
        Allocating more tokens to your DAO makes it easier to onboard future
        members.
      </p>
      <p>We suggest allocating 90% of the initial token supply to your DAO.</p>
    </>
  ),
  existingTokenAddress: (
    <>
      <p>
        DAOs may use an existing token as their governance token. This allows
        creating a DAO around an existing project.
      </p>
      <p>Input the address of your tokens smart contract here.</p>
    </>
  ),
  unstakingDuration: (
    <p>
      The amount of time between unstaking tokens and those tokens being
      avaliable.
    </p>
  ),
  refund: (
    <p>
      Setting this to true will cause proposal deposits to be refunded even if
      the proposal in question fails.
    </p>
  ),
  imageUrl: (
    <p>
      A link to the image that you would like to use for your DAO. For example,
      https://moonphase.is/image.svg
    </p>
  ),
}

export const daoCreateTooltipsGetter = (label: string): TooltipResponse => {
  if (label.startsWith('address_')) {
    return {
      label: 'address',
      content: <p>The address to allocate governance tokens to.</p>,
    }
  }
  if (label.startsWith('weight_')) {
    return {
      label: 'token count',
      content: <p>The number of tokens to allocate to this address.</p>,
    }
  }
  if (label == '') {
    return {
      label: daoCreateTooltipsDefault,
      content: daoCreateTooltips[daoCreateTooltipsDefault],
    }
  }
  return { label, content: daoCreateTooltips[label] }
}

export const daoCreateTooltipsDefault = 'name'