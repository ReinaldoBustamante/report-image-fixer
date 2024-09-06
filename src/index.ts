import { App } from "./presentation/app"
import { Envs } from "./config"
const app = () => {
    const {APIUrl, APIToken} = Envs.getEnvs()
    const application = new App(APIUrl, APIToken)
    application.start()
}

(() => {
    app()
})()