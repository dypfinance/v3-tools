export default function validateFormInfo(values){
    let errors = {}

    if (!values.email_address) {
        errors.email_address = "Email Address is required"
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email_address)) {
        errors.email_address = "Email Address is Invalid"
    }
    if(!values.token_address.trim()){
        errors.token_address = "Token address is required"
    }

    if(!values.softcap.trim()){
        errors.softcap = "Softcap is required"
    }
    if(!values.hardcap.trim()){
        errors.hardcap = "Hardcap is required"
    }
    if(!values.minimumbuy.trim()){
        errors.minimumbuy = "Minimum buy is required"
    }
    if(!values.maxbuy.trim()){
        errors.maxbuy = "Maximum buy is required"
    }

    if(!values.refundType_status.trim()){
        errors.refundType_status = "Refund type is required"
    }
    if(!values.presale_rate.trim()){
        errors.presale_rate = "Presale rate is required"
    }
    if(!values.router_status.trim()){
        errors.router_status = "Router type is required"
    }
    if(!values.pancLiq.trim()){
        errors.pancLiq = "Liquidity is required"
    }
    if(!values.pancListRate.trim()){
        errors.pancListRate = "Listing rate is required"
    }



    if(!values.project_logo.trim()){
        errors.project_logo = "Project logo is required"
    }

    if(!values.project_name.trim()){
        errors.project_name = "Project name is required"
    }
    if(!values.ticker_symbol.trim()){
        errors.ticker_symbol = "Ticker symbol is required"
    }
    if(!values.project_status.trim()){
        errors.project_status = "Project status is required"
    }
    if(!values.team.trim()){
        errors.team = "Team is required"
    }
    if(!values.blockchain_launch.trim()){
        errors.blockchain_launch = "Blockchain launch is required"
    }
    if(!values.raised_funds.trim()){
        errors.raised_funds = "Raised funds is required"
    }
    if(!values.ido_capital.trim()){
        errors.ido_capital = "IDO capital is required"
    }
    if(!values.website.trim()){
        errors.website = "Website is required"
    }
    if(!values.twitter.trim()){
        errors.twitter = "Twitter username is required"
    }
    if(!values.telegram_user.trim()){
        errors.telegram_user = "Telegram username is required"
    }
    if(!values.telegram_channel.trim()){
        errors.telegram_channel = "Telegram channel is required"
    }

    return errors
}