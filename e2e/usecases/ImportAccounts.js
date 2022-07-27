import { by, device, element, expect } from 'detox'
import { ElementName } from '../../src/features/telemetry/constants'
import { sleep } from '../../src/utils/timing'
import { Accounts } from '../utils/fixtures'

export function ImportAccounts() {
  it('creates a readonly account', async () => {
    await element(by.id(ElementName.Manage)).tap()
    await element(by.id(ElementName.ImportAccount)).tap()

    // enter address / eth
    await element(by.id('import_account_form/input')).typeText(Accounts.readonly.address)
    await sleep(500)
    await element(by.id(ElementName.Submit)).tap()

    await device.matchFace()

    // enter account name
    await element(by.id('import_account_form/input')).typeText(Accounts.readonly.name)
    await element(by.id(ElementName.Submit)).tap()

    // Wait for import saga to complete
    await sleep(500)

    await expect(element(by.id(`account_item/${Accounts.readonly.address}`))).toExist()
  })

  it('creates a managed account', async () => {
    await element(by.id(ElementName.Manage)).tap()
    await element(by.id(ElementName.ImportAccount)).tap()

    // enter address / eth
    await element(by.id('import_account_form/input')).typeText(Accounts.managed2.seedPhrase)
    await sleep(500)
    await element(by.id(ElementName.Submit)).tap()

    // @TODO: update with wallet selection screen once e2e tests are updated.

    await device.matchFace()

    // enter account name
    await element(by.id('import_account_form/input')).typeText(Accounts.managed2.name)
    await element(by.id(ElementName.Submit)).tap()

    // Wait for import saga to complete
    await sleep(500)

    await expect(element(by.id(`account_item/${Accounts.managed2.address}`))).toExist()
  })
}
