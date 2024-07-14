const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SocialMediaSchema = new Schema({
  instagram: {
    profile_url: {
      type: String,
    },
    username: {
      type: String,
    },
  },
});

const ContactSchema = new Schema({
  email: {
    type: String,
  },
  socialmedia: {
    type: [SocialMediaSchema],
  },
});

const AdditionalSchema = new Schema({
  additional: {
    title: String,
    html: String,
  },
});

const SettingSchema = new Schema({
  general: {
    homepage: {
      metadata: {
        title: {
          type: String,
          default: "Default Title",
        },
        description: {
          type: String,
          default: "Default description for the homepage.",
        },
      },
    },
    apis: {
      server: {
        api_url: {
          type: String,
          default: "http://example.com/api/",
        },
      },
      cld: {
        enable_cld: {
          type: Boolean,
          default: false,
        },
        api_url: {
          type: String,
          default: "https://api.example.com/v1/",
        },
        api_key: {
          type: String,
          default: "your_api_key",
        },
        cloud_name: {
          type: String,
          default: "your_cloud_name",
        },
        preset_name: {
          type: String,
          default: "your_preset_name",
        },
      },
    },
    security: {
      https_protocol: {
        type: Boolean,
        default: true,
      },
    },
  },
  profile: {
    bio: {
      statement: {
        html: {
          type: String,
          default: "This is a default bio statement.",
        },
      },
      additional: {
        type: [AdditionalSchema],
        default: {
          title: "Default Additional Title",
          html: "<p>Default additional HTML content.</p>",
        },
      },
    },
    contact: {
      type: [ContactSchema],
      default: [
        {
          email: "contact@example.com",
          socialmedia: [
            {
              instagram: {
                profile_url: "https://www.instagram.com/default_profile",
                username: "@default_username",
              },
            },
          ],
        },
      ],
    },
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Ensure only one document in the collection
SettingSchema.statics.findOneOrCreate = async function () {
  let setting = await this.findOne();
  if (!setting) {
    setting = await this.create({});
  }
  return setting;
};

const Setting = mongoose.model("Setting", SettingSchema);

module.exports = Setting;