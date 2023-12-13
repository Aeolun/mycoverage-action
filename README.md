# Upload to MyCoverage GitHub Action

This action uploads coverage data in supported formats to a MyCoverage instance.

## Inputs

| Input     | Description                                                                                                             | Required | Default                                         |
|-----------|-------------------------------------------------------------------------------------------------------------------------|----------|-------------------------------------------------|
| `file`    | The coverage file to upload                                                                                             | Yes      | 'coverage/lcov.info'                            |
| `endpoint`| The endpoint where to send the data                                                                                     | Yes      | 'https://mycoverage.se1.serial-experiments.com' |
| `index`   | The index to use for the coverage data, used when one test is split in multiple instances                               | No       | '1'                                             |
| `testName`| The name of the test suite                                                                                              | No       | github workflow job name                        |
| `coverageRootDirectory`| The root directory of the coverage data, used when coverage is relative to a directory other than the working directory | No       | ''                                              |
| `validateCertificates`| Whether to validate the certificates of the endpoint, set to false if you use a self-signed certificate                 | No       | 'true'                                          |

## Example usage

```yml
uses: actions/upload-to-mycoverage@v1
with:
  file: 'coverage/lcov.info'
  endpoint: 'https://mycoverage.se1.serial-experiments.com'
```
