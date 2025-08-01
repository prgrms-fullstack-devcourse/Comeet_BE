import { GenerateTokenService } from "./generate.token.service";
import { HttpService } from "@nestjs/axios";
import { Test } from "@nestjs/testing";
import { of } from "rxjs";
import { AxiosResponse } from "axios";

describe("GenerateTokenService", () => {
    let service: GenerateTokenService;
    let httpService: HttpService;

    beforeAll(async () => {

        const module = await Test.createTestingModule({
            providers: [
                GenerateTokenService,
                {
                    provide: HttpService,
                    useValue: { post: jest.fn(), }
                }
            ]
        }).compile();

        service = module.get(GenerateTokenService);
        httpService = module.get(HttpService);
    });

    it('should generate token from GitHub OAuth', (done) => {
        const dto = {
            clientId: 'test-client-id',
            clientSecret: 'test-secret',
            code: 'test-code',
        };

        const mockResponse: AxiosResponse = {
            data: {
                access_token: 'mock_token',
                refresh_token: 'mockrefresh_token',
                token_type: 'bearer',
                scope: 'repo',
            },
            status: 200,
            statusText: 'OK',
            headers: {},
        } as AxiosResponse;

        jest.spyOn(httpService, 'post')
            .mockReturnValue(of(mockResponse));

        service.generateToken(dto).subscribe({
            next: (result) => {

                expect(result).toEqual({
                    accessToken: 'mock_token',
                    refreshToken: 'mockrefresh_token',
                });

                done();
            },
            error: (err) => {
                done(err); // let Jest report this
            }
        });
    });


})