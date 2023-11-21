const axios = require('axios');

const VF_API_KEY = "MY VF API KEY";

module.exports.interact = async function interact(chatID, request) {
    let messages = [];
    console.log(`request: `+JSON.stringify(request));

    const response = await axios({
        method: "POST",
        url: `https://general-runtime.voiceflow.com/state/user/${chatID}/interact`,
        headers: {
            Authorization: VF_API_KEY
        },
        data: {
            request
        }

    });

    for (const trace of response.data) {
        switch (trace.type) {
            case "text":
            case "speak":
                {
                    // remove break lines
                    messages.push(this.filter(trace.payload.message));
                    break;
                }
            case "end":
                {
                    messages.push("Bye!");
                    break;
                }
        }
    }

    console.log(`response: `+messages.join(","));
    return messages;
};

module.exports.filter = function filter(string) {
    string = string.replace(/\&#39;/g, '\'')
    string = string.replace(/(<([^>]+)>)/ig, "")
    string = string.replace(/\&/g, ' and ')
    string = string.replace(/[&\\#,+()$~%*?<>{}]/g, '')
    string = string.replace(/\s+/g, ' ').trim()
    string = string.replace(/ +(?= )/g,'')

	return string;
}

module.exports.alexaDetectedEntities = function alexaDetectedEntities(alexaRequest) {
    let entities = [];
    const entitiesDetected = alexaRequest.request.intent.slots;
    for ( const entity of Object.values(entitiesDetected)) {
        entities.push({
            name: entity.name,
            value: entity.value
        });
    }
    return entities;
}

