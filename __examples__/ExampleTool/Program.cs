const string VersionPrefix = "1.0.1";
const string VersionSuffix = "beta";
const string Version = $"{VersionPrefix}-{VersionSuffix}";

const string VersionJson = $$"""
                             {
                               "{{nameof(Version)}}": "{{Version}}",
                               "{{nameof(VersionPrefix)}}": "{{VersionPrefix}}",
                               "{{nameof(VersionSuffix)}}": "{{VersionSuffix}}"
                             }
                             """;

Console.Out.WriteLine(VersionJson);