/* eslint-disable @typescript-eslint/no-explicit-any */

import {Command, Flags, Interfaces} from '@oclif/core'
import * as fs from 'node:fs/promises'
import * as path from 'node:path'

import {ApiConfiguration} from '../api'
import {ResourceObject} from '../output'

export type Flags<T extends typeof Command> = Interfaces.InferredFlags<(typeof BaseCommand)['baseFlags'] & T['flags']>
export type Args<T extends typeof Command> = Interfaces.InferredArgs<T['args']>

export abstract class BaseCommand<T extends typeof Command> extends Command {
  // define flags that can be inherited by any command that extends BaseCommand
  static baseFlags = {
    raw: Flags.boolean({char: 'r', description: 'Output raw JSON (defaults to a table)', required: false}),
  }

  // add the --json flag
  static enableJsonFlag = true

  protected args!: Args<T>
  protected flags!: Flags<T>

  protected async catch(err: Error & {exitCode?: number}): Promise<any> {
    // add any custom logic to handle errors from the command
    // or simply return the parent class error handling
    return super.catch(err)
  }

  protected configFilePath(): string {
    return path.join(this.config.configDir, 'config.json')
  }

  protected async exists(file: string) {
    try {
      await fs.statfs(file)
      return true
    } catch {
      return false
    }
  }

  protected async finally(_: Error | undefined): Promise<any> {
    // called after run and catch regardless of whether or not the command errored
    return super.finally(_)
  }

  public async init(): Promise<void> {
    await super.init()
    const {args, flags} = await this.parse({
      args: this.ctor.args,
      baseFlags: (super.ctor as typeof BaseCommand).baseFlags,
      enableJsonFlag: this.ctor.enableJsonFlag,
      flags: this.ctor.flags,
      strict: this.ctor.strict,
    })
    this.flags = flags as Flags<T>
    this.args = args as Args<T>
  }

  protected async loadConfig(): Promise<ApiConfiguration> {
    if (await this.exists(this.configFilePath())) {
      const file = await fs.readFile(this.configFilePath())
      return JSON.parse(file.toString('utf8')) as ApiConfiguration
    }

    throw new Error('API configuration has not been initialized. Please run the `brale configure` command.')
  }

  protected output<T extends ResourceObject>(i: T | T[] | undefined, override: (_: T) => object = () => ({})) {
    if (this.flags.raw) {
      this.log(JSON.stringify(i))
    } else if (Array.isArray(i)) {
      this.table(i, override)
    } else if (i) {
      this.table([i], override)
    }
  }

  protected table<T extends ResourceObject>(input: T[], override: (_: T) => object = () => ({})) {
    const toRow = (i: T) => {
      const objectAttrs = Object.entries(i.attributes)
        .filter(([, v]) => typeof v === 'object')
        .map(([k, v]) => [k, JSON.stringify(v)])

      return {
        id: i.id,
        ...i.attributes,
        ...Object.fromEntries(objectAttrs),
        ...override(i),
      }
    }

    const data = input.map((i) => toRow(i))

    console.table(data)
  }
}
