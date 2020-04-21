import arg from 'arg'
import { createProject } from './main';
import inquirer from 'inquirer';


//function does exactly what it says it does my guys
function parseArgumentsIntoOptions(rawArgs){
    const args = arg(
        {
            "--git":Boolean,
            "--yes": Boolean,
            "--install": Boolean,
            "-g": "--git",
            '-y':"--yes",
            '-i':'--install'
        },
        {
            argv: rawArgs.slice(2),
        }
    )
    return {
        skipPrompts: args['--yes'] || false,
        git: args['--git'] || false,
        template: args._[0],
        runInstall: args['--install'] || false,
    };
  
    
}

async function promptForMissingOptions(options){
    const defaultTemplate = "react-basic";
    if(options.skipPrompts){
        return {
            ...options,
            template: options.template || defaultTemplate,
        }
    }
    const questions = [];
    if(!options.template){
        questions.push({
            "type":"list",
            "name":"template",
            message: "Please choose a template from the bry bry cli options my guy",
            choices: ["react-basic", "react-redux-basic"],
            default: defaultTemplate
        })
    }
    if(!options.git){
        questions.push({
            type: 'confirm',
            name: 'git',
            message: 'Initialize a git repository?',
            default: false,
        })
    }
    const answers = await inquirer.prompt(questions);
    return {
      ...options,
      template: options.template || answers.template,
      git: options.git || answers.git,
    };
}



async function cli(args) {
let options = parseArgumentsIntoOptions(args)
options = await promptForMissingOptions(options)
await createProject(options);
}
export {cli}