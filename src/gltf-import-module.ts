import {
    centerArts,
    declareModule,
    patternToRegExp,
    string_mime_type_with_wildcard,
    TextArt,
} from '@collboard/modules-sdk';
import textFileIcon from '../assets/text-file-icon.svg';
import { contributors, description, license, repository, version } from '../package.json';

/**
 * TODO: !!! Implement:
 * - GLB/GLTF 1.0 + 2.0
 * - OBJ application/object
 * - STL application/sla
 * - 3MF application/vnd.ms-package.3dmanufacturing-3dmodel+xml
 */

const mimeTypes: string_mime_type_with_wildcard[] = ['model/gltf-binary', 'model/gltf+json'];

declareModule({
    manifest: {
        name: '@hejny/gltf-support',
        version,
        description,
        contributors,
        license,
        repository,
        icon: textFileIcon,
        flags: {
            isTemplate: true,
        },
        supports: {
            fileImport: mimeTypes,
        },
        // Note: Support modules do not need title or some nice public profile because they are typically installed automatically
    },
    async setup(systems) {
        const { importSystem, appState } = await systems.request('importSystem', 'appState');

        return importSystem.registerFileSupport({
            priority: 0,

            async importFile({ file, boardPosition, willCommitArts, next }) {
                if (!mimeTypes.some((mimeType) => patternToRegExp(mimeType).test(file.type))) {
                    return next();
                }

                willCommitArts();

                const textArt = new TextArt(
                    await file.text(),
                    '#009edd',
                    21 / appState.transform.value.scale.x,
                    false,
                    false,
                    false,
                    'none',
                );

                centerArts({ arts: [textArt], boardPosition });

                return textArt;
            },
        });
    },
});

/**
 * [⚗️]
 */
